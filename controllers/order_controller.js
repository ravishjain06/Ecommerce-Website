import Stripe from 'stripe';
import Order from '../models/order_schema.js';
import { Cart } from '../models/cart_schema.js';
import { Product } from '../models/product_schema.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// ------------------ Create Order & Stripe Checkout ------------------ //
export const createOrder = async (req, res) => {
    try {
        const userId = req.id;
        const { shippingAddress, paymentMethod, shippingCost = 0 } = req.body;

        if (!shippingAddress || !paymentMethod) {
            return res.status(400).json({ success: false, message: "Shipping address and payment method are required." });
        }

        const cart = await Cart.findOne({ userId }).populate('items.productId');
        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ success: false, message: "Cart is empty." });
        }

        const totalAmount = cart.totalPrice + shippingCost;

        if (paymentMethod === 'Stripe') {
            const clientUrl = process.env.CLIENT_URL;
            const session = await stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                line_items: cart.items.map(item => ({
                    price_data: {
                        currency: 'inr',
                        product_data: { name: item.productId.name, description: item.size || '' },
                        unit_amount: Math.round(item.price * 100),
                    },
                    quantity: item.quantity,
                })),
                shipping_options: [{
                    shipping_rate_data: {
                        type: 'fixed_amount',
                        fixed_amount: { amount: Math.round(shippingCost * 100), currency: 'inr' },
                        display_name: 'Shipping',
                    },
                }],
                mode: 'payment',
                success_url: `${clientUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
                cancel_url: `${clientUrl}/cart`,
                metadata: {
                    userId,
                    cartId: cart._id.toString(),
                    products: JSON.stringify(cart.items.map(item => ({
                        productId: item.productId._id.toString(),
                        quantity: item.quantity,
                        price: item.price,
                        size: item.size
                    }))),
                    shippingAddress: JSON.stringify(shippingAddress),
                    shippingCost: shippingCost.toString(),
                    totalAmount: totalAmount.toString()
                }
            });

            return res.status(200).json({
                success: true,
                message: "Redirecting to Stripe checkout",
                checkoutUrl: session.url,
                sessionId: session.id
            });
        }

        if (paymentMethod === 'CashOnDelivery') {
            const order = new Order({
                user: userId,
                products: cart.items.map(item => ({
                    productId: item.productId._id,
                    quantity: item.quantity,
                    price: item.price,
                    size: item.size
                })),
                shippingAddress,
                paymentMethod,
                shippingCost,
                totalAmount,
                paymentStatus: 'Pending'
            });

            await order.save();
            await Cart.findOneAndUpdate({ userId }, { $set: { items: [], totalPrice: 0, coupon: null } });
            return res.status(201).json({ success: true, message: "Order placed successfully with Cash on Delivery.", order });
        }
    } catch (error) {
        console.error("Error creating order:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// ------------------ Stripe Webhook for Checkout Events ------------------ //
export const handleStripeWebhook = async (req, res) => {
    const sig = req.headers['stripe-signature'];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
        console.log('✅ Stripe Webhook received:', event.type);
    } catch (err) {
        console.error('❌ Webhook verification failed:', err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    switch (event.type) {
        case 'checkout.session.completed':
            await processCheckoutSessionCompleted(event.data.object);
            break;
        case 'checkout.session.expired':
            await processCheckoutSessionExpired(event.data.object);
            break;
        default:
            console.log(`Unhandled event type: ${event.type}`);
    }

    res.status(200).json({ received: true });
};

// ------------------ Helper Handlers for Webhook ------------------ //
const processCheckoutSessionCompleted = async (session) => {
    try {
        let order = await Order.findOne({ stripeSessionId: session.id });

        if (!order && session.metadata) {
            order = new Order({
                user: session.metadata.userId,
                products: JSON.parse(session.metadata.products),
                shippingAddress: JSON.parse(session.metadata.shippingAddress),
                paymentMethod: 'Stripe',
                shippingCost: Number(session.metadata.shippingCost),
                totalAmount: Number(session.metadata.totalAmount),
                paymentStatus: 'Paid',
                orderStatus: 'Processing',
                stripeSessionId: session.id,
                stripePaymentIntentId: session.payment_intent
            });
            await order.save();
            console.log('✅ New Order Created after payment.');
        } else if (order) {
            order.paymentStatus = 'Paid';
            order.orderStatus = 'Processing';
            order.stripePaymentIntentId = session.payment_intent;
            await order.save();
            console.log('✅ Existing Order Updated.');
        }

        await Cart.findByIdAndUpdate(session.metadata.cartId, { items: [], totalPrice: 0, coupon: null });
    } catch (error) {
        console.error('❌ Error processing completed checkout session:', error);
    }
};

const processCheckoutSessionExpired = async (session) => {
    try {
        const order = await Order.findOne({ stripeSessionId: session.id });
        if (order) {
            order.paymentStatus = 'Failed';
            order.orderStatus = 'Cancelled';
            await order.save();
            console.log('⏰ Order cancelled due to session expiration.');
        }
    } catch (error) {
        console.error('❌ Error processing expired session:', error);
    }
};

// ------------------ Utility Controllers ------------------ //
export const getUserOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.id }).populate('products.productId').sort({ createdAt: -1 });
        res.status(200).json({ success: true, orders });
    } catch (error) {
        console.error("Error fetching orders:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

export const getOrderById = async (req, res) => {
    try {
        const order = await Order.findOne({ _id: req.params.id, user: req.id }).populate('products.productId');
        if (!order) return res.status(404).json({ success: false, message: "Order not found." });
        res.status(200).json({ success: true, order });
    } catch (error) {
        console.error("Error fetching order:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

export const updateOrderStatus = async (req, res) => {
    try {
        const order = await Order.findByIdAndUpdate(req.params.id, { orderStatus: req.body.orderStatus }, { new: true });
        if (!order) return res.status(404).json({ success: false, message: "Order not found." });
        res.status(200).json({ success: true, message: "Order status updated.", order });
    } catch (error) {
        console.error("Error updating order status:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

export const verifyPayment = async (req, res) => {
    try {
        const session = await stripe.checkout.sessions.retrieve(req.query.session_id);
        const order = await Order.findOne({ stripeSessionId: req.query.session_id });
        if (!order) return res.status(404).json({ success: false, message: "Order not found." });
        res.status(200).json({
            success: true,
            stripePaymentStatus: session.payment_status,
            orderPaymentStatus: order.paymentStatus,
            orderStatus: order.orderStatus,
            order
        });
    } catch (error) {
        console.error("Error verifying payment:", error);
        res.status(500).json({ success: false, message: "Error verifying payment." });
    }
};

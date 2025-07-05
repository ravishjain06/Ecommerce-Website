import Stripe from 'stripe';
import Order from '../models/order_schema.js';
import { Cart } from '../models/cart_schema.js';
import { Product } from '../models/product_schema.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Create order with payment method selection
export const createOrder = async (req, res) => {
    try {
        console.log('Request body received:', req.body); // Debug log
        
        const userId = req.id;
        const { 
            shippingAddress, 
            paymentMethod, 
            shippingCost = 0 
        } = req.body;

        // Validate required fields
        if (!shippingAddress || !paymentMethod) {
            return res.status(400).json({
                success: false,
                message: "Shipping address and payment method are required"
            });
        }

        // Get user's cart
        const cart = await Cart.findOne({ userId }).populate('items.productId');
        if (!cart || cart.items.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Cart is empty"
            });
        }

        // Calculate total amount
        let totalAmount = cart.totalPrice + shippingCost;

        // Create order data
        const orderData = {
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
        };

        if (paymentMethod === 'Stripe') {
            // Create Stripe checkout session for redirect
            const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
            
            const session = await stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                line_items: cart.items.map(item => ({
                    price_data: {
                        currency: 'inr',
                        product_data: {
                            name: item.productId.name,
                            description: item.size ? `Size: ${item.size}` : '',
                        },
                        unit_amount: Math.round(item.price * 100), // Convert to cents
                    },
                    quantity: item.quantity,
                })),
                shipping_options: [{
                    shipping_rate_data: {
                        type: 'fixed_amount',
                        fixed_amount: {
                            amount: Math.round(shippingCost * 100),
                            currency: 'inr', // changed from 'usd' to 'inr'
                        },
                        display_name: 'Shipping',
                    },
                }],
                mode: 'payment',
                success_url: `${clientUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
                cancel_url: `${clientUrl}/cart`,
                metadata: {
                    userId: userId.toString(),
                    cartId: cart._id.toString(),
                }
            });

            // Create order with pending payment AFTER session creation
            const order = new Order({
                ...orderData,
                stripeSessionId: session.id
            });
            await order.save();

            console.log('💳 Stripe checkout session created:', {
                sessionId: session.id,
                orderId: order._id,
                totalAmount: order.totalAmount
            });

            // Return checkout URL for redirect
            res.status(200).json({
                success: true,
                message: "Redirecting to Stripe checkout",
                checkoutUrl: session.url,
                orderId: order._id,
                sessionId: session.id
            });

        } else if (paymentMethod === 'CashOnDelivery') {
            // Handle COD as before
            const order = new Order(orderData);
            await order.save();

            await Cart.findOneAndDelete({ userId });

            res.status(201).json({
                success: true,
                message: "Order placed successfully with Cash on Delivery",
                order,
                orderId: order._id
            });
        }

    } catch (error) {
        console.error("Error creating order:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

// Updated Stripe webhook handler for Checkout Sessions
export const handleStripeWebhook = async (req, res) => {
    const sig = req.headers['stripe-signature'];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
        console.log('🔔 Webhook received:', {
            eventType: event.type,
            eventId: event.id,
            created: new Date(event.created * 1000)
        });
    } catch (err) {
        console.error('❌ Webhook signature verification failed:', err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    switch (event.type) {
        case 'checkout.session.completed':
            console.log('🎯 Processing checkout.session.completed event');
            const session = event.data.object;
            await handleCheckoutSessionCompleted(session);
            break;

        case 'checkout.session.expired':
            console.log('⏰ Processing checkout.session.expired event');
            const expiredSession = event.data.object;
            await handleCheckoutSessionExpired(expiredSession);
            break;

        case 'payment_intent.succeeded':
            const paymentIntent = event.data.object;
            console.log('💰 PaymentIntent succeeded:', {
                paymentIntentId: paymentIntent.id,
                amount: paymentIntent.amount / 100,
                currency: paymentIntent.currency
            });
            break;

        case 'payment_intent.payment_failed':
            const failedPayment = event.data.object;
            console.log('❌ Payment failed:', {
                paymentIntentId: failedPayment.id,
                failureCode: failedPayment.last_payment_error?.code,
                failureMessage: failedPayment.last_payment_error?.message
            });
            break;

        default:
            console.log(`❓ Unhandled event type: ${event.type}`);
    }

    console.log('✅ Webhook processed successfully');
    res.json({ received: true });
};

// Handle successful checkout session completion
const handleCheckoutSessionCompleted = async (session) => {
    try {
        console.log('🎉 Checkout session completed:', session.id);
        console.log('Session details:', {
            sessionId: session.id,
            paymentIntent: session.payment_intent,
            customerEmail: session.customer_email,
            amountTotal: session.amount_total / 100, // Convert from cents
            currency: session.currency
        });
        
        // Find order by session ID (order already exists)
        const order = await Order.findOne({ stripeSessionId: session.id });
        
        if (order) {
            console.log('📦 Order found for session:', {
                orderId: order._id,
                userId: order.user,
                currentStatus: order.paymentStatus,
                totalAmount: order.totalAmount
            });

            // Update order status
            const previousStatus = order.paymentStatus;
            const previousOrderStatus = order.orderStatus;
            
            order.paymentStatus = 'Paid';
            order.orderStatus = 'Processing';
            order.stripePaymentIntentId = session.payment_intent;
            await order.save();

            console.log('✅ Payment Status Updated:', {
                orderId: order._id,
                previousPaymentStatus: previousStatus,
                newPaymentStatus: order.paymentStatus,
                previousOrderStatus: previousOrderStatus,
                newOrderStatus: order.orderStatus,
                paymentIntentId: session.payment_intent
            });

            // Clear the cart
            const cartDeleted = await Cart.findOneAndDelete({ userId: order.user });
            if (cartDeleted) {
                console.log('🛒 Cart cleared for user:', order.user);
            }
            
            // Update product stock
            console.log('📊 Updating product stock...');
            for (const item of order.products) {
                const product = await Product.findByIdAndUpdate(
                    item.productId,
                    { $inc: { inStock: -item.quantity } },
                    { new: true }
                );
                
                console.log('📦 Stock updated:', {
                    productId: item.productId,
                    quantityDeducted: item.quantity,
                    newStock: product ? product.inStock : 'Product not found'
                });
            }

            console.log('🎊 Order payment completed successfully:', {
                orderId: order._id,
                paymentStatus: order.paymentStatus,
                orderStatus: order.orderStatus,
                totalAmount: order.totalAmount
            });
            
        } else {
            console.error('❌ Order not found for session:', session.id);
            console.error('Available session metadata:', session.metadata);
        }
    } catch (error) {
        console.error('💥 Error handling checkout session completion:', {
            sessionId: session.id,
            error: error.message,
            stack: error.stack
        });
    }
};

// Handle expired checkout session
const handleCheckoutSessionExpired = async (session) => {
    try {
        console.log('⏰ Checkout session expired:', session.id);
        console.log('Expired session details:', {
            sessionId: session.id,
            expiresAt: session.expires_at,
            customerEmail: session.customer_email
        });
        
        // Find and update order status
        const order = await Order.findOne({ stripeSessionId: session.id });
        
        if (order) {
            const previousPaymentStatus = order.paymentStatus;
            const previousOrderStatus = order.orderStatus;
            
            order.paymentStatus = 'Failed';
            order.orderStatus = 'Cancelled';
            await order.save();
            
            console.log('❌ Order cancelled due to expired session:', {
                orderId: order._id,
                previousPaymentStatus,
                newPaymentStatus: order.paymentStatus,
                previousOrderStatus,
                newOrderStatus: order.orderStatus,
                sessionId: session.id
            });
        } else {
            console.error('❌ Order not found for expired session:', session.id);
        }
    } catch (error) {
        console.error('💥 Error handling expired checkout session:', {
            sessionId: session.id,
            error: error.message,
            stack: error.stack
        });
    }
};

// Get user orders
export const getUserOrders = async (req, res) => {
    try {
        const userId = req.id;
        
        const orders = await Order.find({ user: userId })
            .populate('products.productId')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            orders
        });
    } catch (error) {
        console.error("Error fetching orders:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

// Get single order
export const getOrderById = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.id;

        const order = await Order.findOne({ _id: id, user: userId })
            .populate('products.productId');

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        res.status(200).json({
            success: true,
            order
        });
    } catch (error) {
        console.error("Error fetching order:", error);
        res.status(500).
        json({
            success: false,
            message: "Internal server error"
        });
    }
};

// Update order status (admin only)
export const updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { orderStatus } = req.body;

        const order = await Order.findByIdAndUpdate(
            id,
            { orderStatus },
            { new: true }
        );

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Order status updated successfully",
            order
        });
    } catch (error) {
        console.error("Error updating order status:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

export const verifyPayment = async (req, res) => {
    try {
        const { session_id } = req.query;
        
        // Get session from Stripe
        const session = await stripe.checkout.sessions.retrieve(session_id);
        
        // Find order in database
        const order = await Order.findOne({ stripeSessionId: req.query.session_id });
        
        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        res.status(200).json({
            success: true,
            stripePaymentStatus: session.payment_status, // from Stripe
            orderPaymentStatus: order.paymentStatus,     // from DB
            orderStatus: order.orderStatus,              // from DB
            order: order
        });
        
    } catch (error) {
        console.error("Error verifying payment:", error);
        res.status(500).json({
            success: false,
            message: "Error verifying payment"
        });
    }
};
import mongoose from 'mongoose';
import { Cart } from '../models/cart_schema.js';
import { Product } from '../models/product_schema.js';

const validCoupons = ["SAVE10"]; // Place this at the top for reuse

function sanitizeCoupon(coupon) {
    console.log("[sanitizeCoupon] Received coupon:", coupon);
    const isValid = validCoupons.includes(coupon);
    console.log("[sanitizeCoupon] Is valid:", isValid);
    return isValid ? coupon : null;
}

function applyCoupon(total, coupon) {
    console.log("[applyCoupon] Total before:", total, "Coupon:", coupon);
    if (coupon && coupon === "SAVE10") {
        const discounted = total - total * 0.10;
        console.log("[applyCoupon] Discount applied. Total after:", discounted);
        return discounted;
    }
    console.log("[applyCoupon] No discount applied.");
    return total;
}

export const addToCart = async (req, res) => {
    try {
        const { id: productId } = req.params;
        const { quantity = 1, size } = req.body;
        let userId = req.id;
        if (Buffer.isBuffer(userId)) {
            userId = userId.toString('hex');
        }

        // Fetch the product from the database
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        let cart = await Cart.findOne({ userId }).populate('items.productId');

        if (!cart) {
            cart = new Cart({
                userId,
                items: [],
                totalPrice: 0,
                coupon: null
            });
        }

        if (!cart.items) {
            cart.items = [];
        }

        // Check if product already exists in cart
        const existingItemIndex = cart.items.findIndex(
            item =>
                item.productId &&
                ((item.productId._id?.toString?.() || item.productId.toString?.()) === productId) &&
                item.size === size
        );

        if (existingItemIndex > -1) {
            // Update quantity if item exists
            cart.items[existingItemIndex].quantity += parseInt(quantity);
        } else {
            // Add new item to cart
            cart.items.push({
                productId,
                quantity: parseInt(quantity),
                size,
                price: product.price
            });
        }

        // Calculate total price WITHOUT coupon
        cart.totalPrice = cart.items.reduce((total, item) => {
            return total + (item.price * item.quantity);
        }, 0);

        await cart.save();

        res.status(200).json({
            success: true,
            message: "Product added to cart successfully",
            cart: {
                ...cart.toObject(),
                coupon: sanitizeCoupon(cart.coupon)
            }
        });

    } catch (error) {
        console.error("Error adding to cart:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

export const getCart = async (req, res) => {
    try {
        const userId = req.id;
        console.log("[getCart] userId:", userId);
        const cart = await Cart.findOne({ userId }).populate('items.productId');
        console.log("[getCart] Cart found:", !!cart);

        if (!cart || !cart.items || cart.items.length === 0) {
            console.log("[getCart] Cart is empty or not found.");
            return res.status(200).json({
                success: true,
                message: "Your cart is empty",
                data: cart,
                totalPrice: 0,
                coupon: null,
                discountPercent: null
            });
        }

        let total = 0;
        for (let item of cart.items) {
            total += item.price * item.quantity;
        }
        console.log("[getCart] Total before coupon:", total);

        let discountPercent = null;
        let appliedCoupon = sanitizeCoupon(cart.coupon);
        if (appliedCoupon) {
            discountPercent = 10;
            total = applyCoupon(total, appliedCoupon);
        }

        console.log("[getCart] Total after coupon:", total, "Applied coupon:", appliedCoupon);

        res.status(200).json({
            success: true,
            data: { ...cart.toObject(), coupon: appliedCoupon },
            totalPrice: total,
            coupon: appliedCoupon,
            discountPercent
        });
    } catch (error) {
        console.error("Error in getCart:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

export const updateQuantity = async (req, res) => {
    console.log("Updating quantity in cart");
    try {
        const { productId, quantity, size } = req.body;
        const userId = req.id;

        if (!productId || !quantity || quantity < 1) {
            return res.status(400).json({
                success: false,
                message: "Product ID and valid quantity are required"
            });
        }

        const cart = await Cart.findOne({ userId }).populate('items.productId');
        if (!cart || !Array.isArray(cart.items)) {
            return res.status(404).json({
                success: false,
                message: "Cart not found"
            });
        }

        // Find the item to update, with extra null checks
        const itemIndex = cart.items.findIndex(item => {
            if (!item || !item.productId) return false;
            const idStr = item.productId._id?.toString?.() || item.productId.toString?.();
            return idStr === productId && (!size || item.size === size);
        });

        if (itemIndex === -1) {
            return res.status(404).json({
                success: false,
                message: "Item not found in cart"
            });
        }

        // Update quantity
        cart.items[itemIndex].quantity = parseInt(quantity);

        // Recalculate total price
        let total = 0;
        for (let item of cart.items) {
            if (item && typeof item.price === "number" && typeof item.quantity === "number") {
                total += item.price * item.quantity;
            }
        }

        // Apply coupon if exists
        total = applyCoupon(total, cart.coupon);
        cart.totalPrice = total;

        await cart.save();
        res.status(200).json({
            success: true,
            message: "Quantity updated successfully",
            data: { ...cart.toObject(), coupon: sanitizeCoupon(cart.coupon) }
        });
    } catch (error) {
        console.error("Error in updateQuantity:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message 
        });
    }
};

export const removeFromCart = async (req, res) => {
    console.log("Removing item from cart");
    try {
        const { productId,size  } = req.body;
        const userId = req.id; // Get from authentication middleware

        if (!productId) {
            return res.status(400).json({
                success: false,
                message: "Product ID is required"
            });
        }

        const cart = await Cart.findOne({ userId }).populate('items.productId');
        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "Cart not found"
            });
        }

        // Log items before removal
        console.log("Cart items before:", cart.items.map(i => ({
            id: i?.productId?._id?.toString?.() || i?.productId?.toString?.(),
            size: i?.size
        })));

        // Remove the item from cart (with null checks)
        cart.items = cart.items.filter(item => {
            if (!item || !item.productId) return true;
            const idStr = (item.productId._id?.toString?.() || item.productId.toString?.() || "");
            // If size is provided, match both productId and size
            if (size) {
                return !(idStr === String(productId).trim() && item.size === size);
            }
            // Otherwise, match only productId
            return idStr !== String(productId).trim();
        });

        // Log items after removal
        console.log("Cart items after:", cart.items.map(i => ({
            id: i?.productId?._id?.toString?.() || i?.productId?.toString?.(),
            size: i?.size
        })));

        // Recalculate total price
        let total = 0;
        for (let item of cart.items) {
            if (item && typeof item.price === "number" && typeof item.quantity === "number") {
                total += item.price * item.quantity;
            }
        }

        // Apply coupon if exists
        total = applyCoupon(total, cart.coupon);
        cart.totalPrice = total;

        await cart.save();

        res.status(200).json({
            success: true,
            message: "Item removed from cart successfully",
            data: { ...cart.toObject(), coupon: sanitizeCoupon(cart.coupon) }
        });
    } catch (error) {
        console.error("Error in removeFromCart:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

export const applyCouponToCart = async (req, res) => {
    try {
        const userId = req.id;
        const { coupon } = req.body;
        console.log("[applyCouponToCart] userId:", userId, "Coupon received:", coupon);

        // Define valid coupons
        console.log("[applyCouponToCart] Valid coupons:", validCoupons);

        // Validate coupon
        if (!validCoupons.includes(coupon)) {
            console.log("[applyCouponToCart] Invalid coupon attempted:", coupon);
            return res.status(400).json({
                success: false,
                message: "Invalid coupon code"
            });
        }

        const cart = await Cart.findOne({ userId }).populate('items.productId');
        console.log("[applyCouponToCart] Cart found:", !!cart);

        if (!cart) {
            console.log("[applyCouponToCart] Cart not found for user:", userId);
            return res.status(404).json({
                success: false,
                message: "Cart not found"
            });
        }

        // Store only valid coupon
        cart.coupon = coupon;
        console.log("[applyCouponToCart] Coupon set in cart:", cart.coupon);

        // Recalculate total price with coupon
        let total = 0;
        for (let item of cart.items) {
            total += item.price * item.quantity;
        }
        console.log("[applyCouponToCart] Total before coupon:", total);

        total = applyCoupon(total, coupon);
        cart.totalPrice = total;
        console.log("[applyCouponToCart] Total after coupon:", total);

        await cart.save();
        console.log("[applyCouponToCart] Cart saved with coupon:", cart.coupon);

        // Always sanitize coupon in response
        const sanitizedCart = {
            ...cart.toObject(),
            coupon: sanitizeCoupon(cart.coupon)
        };
        console.log("[applyCouponToCart] Sanitized coupon for response:", sanitizedCart.coupon);

        res.status(200).json({
            success: true,
            message: "Coupon applied successfully",
            data: sanitizedCart,
            totalPrice: total,
            coupon: sanitizedCart.coupon
        });
    } catch (error) {
        console.error("Error in applyCouponToCart:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

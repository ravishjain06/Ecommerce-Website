import mongoose from 'mongoose';
import { Cart } from '../models/cart_schema.js';
import { Product } from '../models/product_schema.js';

// Only apply discount if coupon code matches "SAVE10"
function applyCoupon(total, coupon) {
    if (coupon && coupon === "SAVE10") {
        return total - total * 0.10; 
    }
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
                coupon: cart.coupon && cart.coupon === "SAVE10" ? cart.coupon : null
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
        const cart = await Cart.findOne({ userId }).populate('items.productId');

        // If cart does not exist or has no items
        if (!cart || !cart.items || cart.items.length === 0) {
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

        // Only apply coupon if it exists and is valid
        let discountPercent = null;
        let appliedCoupon = null;
        if (cart.coupon && cart.coupon === "SAVE10") {
            discountPercent = 10;
            appliedCoupon = cart.coupon;
            total = applyCoupon(total, cart.coupon);
        }

        res.status(200).json({
            success: true,
            data: cart,
            totalPrice: total,
            coupon: appliedCoupon,         // Only show if actually applied
            discountPercent                // Only show if actually applied
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
            data: cart
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
            data: cart
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

        const cart = await Cart.findOne({ userId }).populate('items.productId');
        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "Cart not found"
            });
        }

        // Store the coupon in the cart
        cart.coupon = coupon;

        // Recalculate total price with coupon
        let total = 0;
        for (let item of cart.items) {
            total += item.price * item.quantity;
        }
        total = applyCoupon(total, coupon);
        cart.totalPrice = total;

        await cart.save();

        res.status(200).json({
            success: true,
            message: "Coupon applied successfully",
            data: cart,
            totalPrice: total,
            coupon
        });
    } catch (error) {
        console.error("Error in applyCouponToCart:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

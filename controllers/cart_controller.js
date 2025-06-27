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
        const userId = req.id;

        // Validate product exists
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        // Check if product is in stock
        if (!product.inStock) {
            return res.status(400).json({
                success: false,
                message: "Product is out of stock"
            });
        }

        // Find user's cart or create new one
        let cart = await Cart.findOne({ userId });

        if (!cart) {
            cart = new Cart({
                userId,
                items: [],
                totalPrice: 0,
                coupon: null
            });
        }

        // Ensure items array exists (defensive programming)
        if (!cart.items) {
            cart.items = [];
        }

        // Check if product already exists in cart
        const existingItemIndex = cart.items.findIndex(
            item => item.productId.toString() === productId && item.size === size
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

        // Calculate total price
        cart.totalPrice = cart.items.reduce((total, item) => {
            return total + (item.price * item.quantity);
        }, 0);

        await cart.save();

        res.status(200).json({
            success: true,
            message: "Product added to cart successfully",
            cart
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
        const userId = req.id; // Get from authentication middleware
        const { coupon } = req.query;

        const cart = await Cart.findOne({ userId })
            .populate('items.productId');

        // If cart exists but has no items
        if (cart && (!cart.items || cart.items.length === 0)) {
            return res.status(200).json({
                success: true,
                message: "Your cart is empty",
                data: cart,
                totalPrice: 0,
                coupon: coupon || cart.coupon
            });
        }

        // If cart does not exist at all
        if (!cart) {
            return res.status(200).json({
                success: true,
                message: "Your cart is empty",
                data: null,
                totalPrice: 0,
                coupon: null
            });
        }

        let total = 0;
        for (let item of cart.items) {
            total += item.price * item.quantity;
        }

        // Apply coupon if provided
        total = applyCoupon(total, coupon || cart.coupon);

        res.status(200).json({
            success: true,
            data: cart,
            totalPrice: total,
            coupon: coupon || cart.coupon
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
    try {
        const { productId, quantity, size } = req.body;
        const userId = req.id; // Get from authentication middleware

        if (!productId || !quantity || quantity < 1) {
            return res.status(400).json({
                success: false,
                message: "Product ID and valid quantity are required"
            });
        }

        const cart = await Cart.findOne({ userId }).populate('items.productId');
        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "Cart not found"
            });
        }

        // Find the item to update
        const itemIndex = cart.items.findIndex(
            item => item.productId._id.toString() === productId &&
                (!size || item.size === size)
        );

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
            total += item.price * item.quantity;
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
            message: "Internal Server Error"
        });
    }
};

export const removeFromCart = async (req, res) => {
    try {
        const { productId } = req.body;
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

        // Remove the item from cart
        cart.items = cart.items.filter(
            item => !(item.productId._id.toString() === productId)

        );

        // Recalculate total price
        let total = 0;
        for (let item of cart.items) {
            total += item.price * item.quantity;
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


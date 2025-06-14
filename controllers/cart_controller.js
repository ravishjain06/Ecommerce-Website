import mongoose from 'mongoose';
import { Cart } from '../models/cart_schema.js';
import { Product } from '../models/product_schema.js';

// Only apply discount if coupon code matches "SAVE10"
function applyCoupon(total, coupon) {
    if (coupon && coupon === "SAVE10") {
        return total - total * 0.10; // 10% discount
    }
    return total;
}

export const addToCart = async (req, res) => {
    try {
        const { userId, productId, quantity, coupon } = req.body;

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        let cart = await Cart.findOne({ user: userId });
        if (!cart) {
            let total = product.price * (quantity || 1);
            total = applyCoupon(total, coupon);
            cart = new Cart({
                user: userId,
                product: [productId],
                quantity: quantity || 1,
                totalPrice: total,
                coupon: coupon || null
            });
        } else {
            if (!cart.product.includes(productId)) {
                cart.product.push(productId);
            }
            cart.quantity = quantity || cart.quantity;
            let total = 0;
            for (let prodId of cart.product) {
                const prod = await Product.findById(prodId);
                if (prod) total += prod.price * cart.quantity;
            }
            total = applyCoupon(total, coupon);
            cart.totalPrice = total;
            cart.coupon = coupon || null;
        }

        await cart.save();
        res.status(200).json({ success: true, data: cart });
    } catch (error) {
        console.error("Error in addToCart:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

export const getCart = async (req, res) => {
    try {
        const { userId, coupon } = req.query;

        const cart = await Cart.findOne({ user: userId })
            .populate('product');
        if (!cart) {
            return res.status(404).json({ success: false, message: "Cart not found" });
        }

        let total = 0;
        for (let prod of cart.product) {
            total += prod.price * cart.quantity;
        }
        total = applyCoupon(total, coupon || cart.coupon);

        res.status(200).json({ success: true, data: cart, totalPrice: total, coupon: coupon || cart.coupon });
    } catch (error) {
        console.error("Error in getCart:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

export const updateQuantity = async (req, res) => {
    try {
        const { userId, quantity, coupon } = req.body;

        const cart = await Cart.findOne({ user: userId }).populate('product');
        if (!cart) {
            return res.status(404).json({ success: false, message: "Cart not found" });
        }

        cart.quantity = quantity;

        let total = 0;
        for (let prod of cart.product) {
            total += prod.price * quantity;
        }
        total = applyCoupon(total, coupon || cart.coupon);
        cart.totalPrice = total;
        cart.coupon = coupon || cart.coupon || null;

        await cart.save();
        res.status(200).json({ success: true, data: cart });
    } catch (error) {
        console.error("Error in updateQuantity:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

export const removeFromCart = async (req, res) => {
    try {
        const { userId, productId, coupon } = req.body;

        const cart = await Cart.findOne({ user: userId }).populate('product');
        if (!cart) {
            return res.status(404).json({ success: false, message: "Cart not found" });
        }

        cart.product = cart.product.filter(
            prod => prod._id.toString() !== productId
        );

        let total = 0;
        for (let prod of cart.product) {
            total += prod.price * cart.quantity;
        }
        total = applyCoupon(total, coupon || cart.coupon);
        cart.totalPrice = total;
        cart.coupon = coupon || cart.coupon || null;

        await cart.save();
        res.status(200).json({ success: true, data: cart });
    } catch (error) {
        console.error("Error in removeFromCart:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};


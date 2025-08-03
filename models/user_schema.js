import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ["customer", "seller", "admin"],
        default: "customer",
        required: true,
    },
    profilePicture: {
        type: String,
        default: "",
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    isBlocked: { // <-- Add this field
        type: Boolean,
        default: false,
    },
    refreshToken: {
        type: String,
        default: "",
    },
    Product:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
    }],
    Cart: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Cart",
    }],
    orders: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
    }],
    wishlist: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
    }],
    phone:{
        type: String,
    },
    dateOfBirth: {
        type: String,
        default: "",
    }
}, { timestamps: true });

export const User = mongoose.model('User', userSchema);
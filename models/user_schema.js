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
        default: "https://img.freepik.com/free-psd/contact-icon-illustration-isolated_23-2151903337.jpg?t=st=1746337821~exp=1746341421~hmac=0dfce26dcfcd6cd10e1164cf42373f7e6642d2312813765fbb1dcd7e774d46a9&w=740",
    },
    isVerified: {
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
        
       
    }
}, { timestamps: true });

export const User = mongoose.model('User', userSchema);
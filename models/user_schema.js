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
        enum: ["customer", "seller", "admin", "delivery"],
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
}, { timestamps: true });

export const User = mongoose.model('User', userSchema);
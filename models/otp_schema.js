import mongoose from "mongoose";

const emailVerificationSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    otp: {
        type: String,
        required: true,
    },
    name: String,
    password: String,
    role: String,
    profilePicture: String,
    createdAt: {
        type: Date,
        default: Date.now,
        expires: '15m' // OTP expires in 15 minutes
    }
});

export const EmailVerification = mongoose.model("EmailVerification", emailVerificationSchema);

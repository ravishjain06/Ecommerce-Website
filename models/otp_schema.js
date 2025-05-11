import mongoose from "mongoose";

const emailVerficationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    otp: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: '15min' // OTP expires in 5 minutes
    }

})

export const EmailVerification = mongoose.model("EmailVerification", emailVerficationSchema)

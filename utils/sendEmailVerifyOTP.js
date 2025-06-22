import { EmailVerification } from "../models/otp_schema.js";
import transporter from "./emailConfig.js";

const sendEmailVerifyOTP = async (req, user, otp = null) => {
    // Use provided OTP or generate a new one
    const OTP = otp || Math.floor(100000 + Math.random() * 900000).toString();

    // Save or update EmailVerification with all required fields
    await EmailVerification.findOneAndUpdate(
        { email: user.email },
        {
            email: user.email,
            otp: OTP,
            name: user.name,
            password: user.password,
            role: user.role,
            profilePicture: user.profilePicture,
            createdAt: new Date()
        },
        { upsert: true, new: true }
    );

    const otpVerifyLink = `${process.env.FRONTEND_URL}/account/verify-email`;

    await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: user.email,
        subject: "🔐 Verify Your Email Address",
        html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
                <img src="cid:logo" alt="Company Logo" style="max-width: 150px; margin-bottom: 20px;" />
                <h2 style="color: #444;">Welcome to Our Platform</h2>
                <p style="font-size: 16px;">Hello ${user.name},</p>
                <p>Thank you for registering. Please verify your email using the OTP below:</p>
                <div style="font-size: 24px; font-weight: bold; margin: 20px 0;">${OTP}</div>
                <p>This OTP is valid for <strong>15 minutes</strong> only.</p>
                <p>Or click the button below to verify directly:</p>
                <a href="${otpVerifyLink}" style="display: inline-block; background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Verify Email</a>
                <p style="margin-top: 30px; font-size: 12px; color: #777;">If you didn’t request this, please ignore this email.</p>
            </div>
        `
    });

    return OTP;
};

export default sendEmailVerifyOTP;
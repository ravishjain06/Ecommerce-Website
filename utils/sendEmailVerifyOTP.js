import { EmailVerification } from "../models/otp_schema.js";
import transporter from "./emailConfig.js";

const sendEmailVerifyOTP = async (req, user, otp) => {
    // Only send the email, do not generate or save OTP here!
    await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: user.email,
        subject: "Verify your email",
        html: `<p>Your OTP for WEAREX registration is: <b>${otp}</b></p>`
    });
};

export default sendEmailVerifyOTP;
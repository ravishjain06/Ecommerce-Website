import transporter from "./emailConfig.js";

const sendEmailVerifyOTP = async (req, user, otp) => {
    await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: user.email,
        subject: "Verify Your Email - WEAREX",
        html: `
            <div style="font-family: Arial, sans-serif; padding: 20px;">
                <h2 style="color: #333;">Email Verification</h2>
                <p>Thank you for registering with <strong>WEAREX</strong>.</p>
                <p>Your OTP for email verification is:</p>
                <p style="font-size: 20px; font-weight: bold; color: #007BFF;">
                    ${otp}
                </p>
                <p>Please enter this OTP to complete your verification.</p>
                <br/>
                <p style="color: #555;">If you did not request this, you can safely ignore this email.</p>
                <p style="margin-top: 20px; font-size: 12px; color: #aaa;">
                    &copy; ${new Date().getFullYear()} WEAREX. All rights reserved.
                </p>
            </div>
        `,
    });
};

export default sendEmailVerifyOTP;

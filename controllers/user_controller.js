import argon2 from "argon2"
import { User } from "../models/user_schema.js";
import sendEmailVerifyOTP from "../utils/sendEmailVerifyOTP.js";
import { EmailVerification } from "../models/otp_schema.js";
import crypto from "crypto";
import transporter from "../utils/emailConfig.js";
import fs from "fs";
import imagekit from "../utils/imagekit.js";
import jwt from "jsonwebtoken";
import { generateAccessToken, generateRefreshToken } from "../utils/tokens.js";

export const Register = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;
        const file = req.file;

        let profilePictureUrl = null;
        if (file) {
            const uploadedImage = await imagekit.upload({
                file: fs.readFileSync(file.path),
                fileName: file.originalname,
                folder: "my_uploads",
            });
            profilePictureUrl = uploadedImage.url;
            fs.unlinkSync(file.path);
        }

        if (!name || !email || !password ) {
            return res.status(400).json({
                success: false,
                message: "Required fields are missing or empty."
            });
        }

        // Check if user already exists in User collection
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({
                success: false,
                message: "User with this email already exists."
            });
        }

        // Hash password
        const hashPassword = await argon2.hash(password);

        // Generate OTP
        const OTP = Math.floor(100000 + Math.random() * 900000).toString();

        // Save registration data and OTP in EmailVerification collection
        await new EmailVerification({
            email, // <-- must be present
            otp: OTP,
            name,
            password: hashPassword,
            
            profilePicture: profilePictureUrl,
            createdAt: new Date()
        }).save();

        // Send OTP email
        await sendEmailVerifyOTP(req, { email, name }, OTP);

     

        return res.status(200).json({
            success: true,
            message: "OTP sent to your email. Please verify to complete registration."
        });
    } catch (error) {
        next(error);
    }
};

export const VerifyEmail = async (req, res, next) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({
                success: false,
                message: "Required fields are missing or empty.",
            });
        }

        // Find pending registration
        const pending = await EmailVerification.findOne({ email });
        if (!pending) {
            return res.status(404).json({
                success: false,
                message: "No pending registration found. Please register again.",
            });
        }

        if (pending.otp !== otp) {
            return res.status(400).json({
                success: false,
                message: "Invalid OTP.",
            });
        }

        // Check if user already exists (race condition check)
        const userExists = await User.findOne({ email });
        if (userExists) {
            await EmailVerification.deleteOne({ _id: pending._id });
            return res.status(400).json({
                success: false,
                message: "User with this email already exists."
            });
        }

        // Save user in User collection
        const user = new User({
            name: pending.name,
            email: pending.email,
            password: pending.password,
            role: pending.role,
            profilePicture: pending.profilePicture,
            isVerified: true
        });
        await user.save();

        // Remove pending registration
        await EmailVerification.deleteOne({ _id: pending._id });

        return res.status(201).json({
            success: true,
            message: "Email verified and user registered successfully.",
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                profilePicture: user.profilePicture,
                isVerified: user.isVerified
            }
        });
    } catch (error) {
        next(error);
    }
};

export const Login = async (req, res, next) => {
    try {
        const { email, password } = req.body


        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Invalid Credentials"
            });
        }
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid Credentials"
            });
        }

        const matchPassword = await argon2.verify(user.password, password);

        if (!matchPassword) {
            return res.status(400).json({
                success: false,
                message: "Invalid Credentials"
            });
        }

        const accessToken = generateAccessToken(user)
        const refreshToken = generateRefreshToken(user)

        user.refreshToken = refreshToken
        await user.save()

        return res
            .cookie('accessToken', accessToken, {
                httpOnly: true,
                maxAge: 3 * 24 * 60 * 60 * 1000,
                sameSite: 'none',
                secure: true
            })
            .cookie('refreshToken', refreshToken, {
                httpOnly: true,
                maxAge: 6 * 24 * 60 * 60 * 1000,
                sameSite: 'none',
                secure: true
            })
            .status(200)
            .json({
                success: true,
                message: 'Login successful',
                user: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    profilePicture: user.profilePicture,
                    isVerified: user.isVerified,
                },
                accessToken: accessToken,
                refreshToken: refreshToken,
            });


    } catch (error) {
        console.log(error);

    }
}

export const renewRefreshToken = async (req, res, next) => {
    try {
        const { refreshToken } = req.cookies

        if (!refreshToken) {
            return res.status(401).json({
                success: false,
                message: "Refresh token is missing or invalid."
            });
        }
        const verifyToken = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)
        if (!verifyToken) {
            return res.status(401).json({
                success: false,
                message: "Refresh token not matched."
            });
        }

        const user = await User.findById(verifyToken.id);

        if (!user || user.refreshToken !== refreshToken) {
            return res.status(401).json({
                success: false,
                message: "User not found or refresh token mismatch."
            });
        }
        const newAccessToken = generateAccessToken(user._id);

        res.status(200).json({ accessToken: newAccessToken });

    } catch (error) {
        console.log(error);
        return res.status(401).json({ success: false, message: "Invalid or expired refresh token." });
    }
}

export const Logout = async (req, res, next) => {
    try {
        return res.clearCookie('accessToken', {
            httpOnly: true,
            secure: true,         
            sameSite: 'strict',
        }).status(200).json({
            success: true,
            message: "Logout successful"
        })
    } catch (error) {
        console.log(error);

    }
}

export const getUserProfile = async (req, res, next) => {
    try {
        const userId = req.id
  
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User ID is missing."
            });
        }
        const user = await User.findById(userId).select("-password -refreshToken");

        return res.status(200).json({
            success: true,
            user
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}

export const updateUserProfile = async (req, res, next) => {
    try {
        console.log("Raw req.body:", req.body);
        console.log("Raw req.file:", req.file);

        const userId = req.id;
        const file = req.file; // <-- Add this line

        if (!req.body) {
            return res.status(400).json({
                success: false,
                message: "No data sent in request body."
            });
        }
        const { name, email, phone, profilePicture, currentPassword, newPassword, dateOfBirth } = req.body

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User ID is missing."
            });
        }
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }

        // If user wants to update password
        if (newPassword) {
            if (!currentPassword) {
                return res.status(400).json({
                    success: false,
                    message: "Current password is required to update password."
                });
            }

            // Verify current password
            const isCurrentPasswordValid = await argon2.verify(user.password, currentPassword);
            if (!isCurrentPasswordValid) {
                return res.status(400).json({
                    success: false,
                    message: "Current password is incorrect."
                });
            }

            // Validate new password (optional - add your validation rules)
            if (newPassword.length < 6) {
                return res.status(400).json({
                    success: false,
                    message: "New password must be at least 6 characters long."
                });
            }

            // Hash new password
            const hashedNewPassword = await argon2.hash(newPassword);
            user.password = hashedNewPassword;
        }

        let profilePictureUrl = null

        if (name) user.name = name;
        if (email) {
            // Check if email is already taken by another user
            const emailExists = await User.findOne({ email, _id: { $ne: userId } });
            if (emailExists) {
                return res.status(400).json({
                    success: false,
                    message: "Email is already taken by another user."
                });
            }
            user.email = email;
        }
        if (phone) user.phone = phone;
        if (file) {
            const uploadedImage = await imagekit.upload({
                file: fs.readFileSync(file.path), // Binary file data
                fileName: file.originalname, // Image name
                folder: "my_uploads", // Optional folder in ImageKit
            });
            profilePictureUrl = uploadedImage.url; // Get the URL of the uploaded image
            fs.unlinkSync(file.path); // Clean up the temporary file
        }
        if (file) user.profilePicture = profilePictureUrl;

        await user.save();
        return res.status(200).json({
            success: true,
            message: "User profile updated successfully.",
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                profilePicture: user.profilePicture,
                role: user.role,
                isVerified: user.isVerified
            }
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}

// Send reset link to email
export const forgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ success: false, message: "Email is required." });

        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ success: false, message: "User not found." });

        // Generate JWT token for reset (expires in 30 min)
        const resetToken = jwt.sign(
            { id: user._id, email: user.email },
            process.env.REFRESH_TOKEN_SECRET, // or a dedicated RESET_TOKEN_SECRET
            { expiresIn: "10m" }
        );

        // Send email
        const resetUrl = `${process.env.CLIENT_URL}/auth/reset-password/${resetToken}`;
        await transporter.sendMail({
            from: process.env.EMAIL_FROM,
            to: user.email,
            subject: "Password Reset",
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; border: 1px solid #eee; border-radius: 8px; padding: 32px 24px; background: #fafbfc;">
            <h2 style="color: #333; margin-bottom: 16px;">Reset Your Password</h2>
            <p style="color: #444; font-size: 16px;">
                We received a request to reset your password for <b>WeAreX</b>. Click the button below to set a new password. This link is valid for <b>10 minutes</b>.
            </p>
            <div style="text-align: center; margin: 32px 0;">
                <a href="${resetUrl}" style="background: #007bff; color: #fff; text-decoration: none; padding: 12px 28px; border-radius: 5px; font-size: 16px; display: inline-block;">
                    Reset Password
                </a>
            </div>
            <p style="color: #888; font-size: 13px;">
                If you did not request this, you can safely ignore this email.<br>
                <br>
                <b>Link not working?</b> Copy and paste this URL into your browser:<br>
                <span style="color: #007bff; word-break: break-all;">${resetUrl}</span>
            </p>
            <hr style="margin: 32px 0 12px 0; border: none; border-top: 1px solid #eee;">
            <div style="color: #aaa; font-size: 12px; text-align: center;">
                &copy; ${new Date().getFullYear()} WEAREX
            </div>
        </div>
    `
        });

        res.status(200).json({ success: true, message: "Reset link sent to your email." });
    } catch (error) {
        next(error);
    }
};



export const resetPassword = async (req, res, next) => {
    try {
        const { token } = req.params;
        const { newPassword } = req.body;
        if (!token || !newPassword) return res.status(400).json({ success: false, message: "Token and new password required." });


        let payload;
        try {
            payload = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
        } catch (err) {
            return res.status(400).json({ success: false, message: "Invalid or expired token." });
        }

        const user = await User.findById(payload.id);
        if (!user) return res.status(404).json({ success: false, message: "User not found." });

        user.password = await argon2.hash(newPassword);
        await user.save();

        res.status(200).json({ success: true, message: "Password reset successful." });
    } catch (error) {
        next(error);
    }
};

export const resendVerificationEmail = async (req, res, next) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ success: false, message: "Email is required." });
        }

        const pending = await EmailVerification.findOne({ email });
        if (!pending) {
            return res.status(404).json({ success: false, message: "No pending registration found for this email." });
        }

        // Generate new OTP
        const OTP = Math.floor(100000 + Math.random() * 900000).toString();
        pending.otp = OTP;
        pending.createdAt = new Date();
        await pending.save();

        // Send verification email
        await sendEmailVerifyOTP(req, { email: pending.email, name: pending.name }, OTP);

        return res.status(200).json({ success: true, message: "Verification email resent. Please check your inbox." });
    } catch (error) {
        next(error);
    }
};
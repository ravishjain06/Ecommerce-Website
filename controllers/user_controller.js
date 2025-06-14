import argon2 from "argon2"
import { User } from "../models/user_schema.js";
import sendEmailVerifyOTP from "../utils/sendEmailVerifyOTP.js";
import { EmailVerification } from "../models/otp_schema.js";

import fs from "fs";
import imagekit from "../utils/imagekit.js";
import jwt from "jsonwebtoken";
import { generateAccessToken, generateRefreshToken } from "../utils/tokens.js";

export const Register = async (req, res, next) => {
    try {
        const { name, email, password, role } = req.body;
        const file = req.file;


        let profilePictureUrl = null;

        if (file) {
            const uploadedImage = await imagekit.upload({
                file: fs.readFileSync(file.path), // Binary file data
                fileName: file.originalname, // Image name
                folder: "my_uploads", // Optional folder in ImageKit
            });
            profilePictureUrl = uploadedImage.url; // Get the URL of the uploaded image
            fs.unlinkSync(file.path); // Clean up the temporary file
        }

        if (!name || !email || !password || !role) {
            return res.status(400).json({
                success: false,
                message: "Required fields are missing or empty."
            });
        }

        const userExits = await User.findOne({ email });

        if (userExits) {
            return res.status(400).json({
                success: false,
                message: "User with this email already exists."
            });
        }

        const hashPassword = await argon2.hash(password);

        const user = await User.create({
            name,
            email,
            password: hashPassword,
            role,
            profilePicture: profilePictureUrl, // Use the uploaded URL or default
        });

        sendEmailVerifyOTP(req, user);
        
        await user.save();

        return res.status(201).json({
            success: true,
            message: "User registered successfully.",
            user
        });
    } catch (error) {
        next(error);
    }
}

export const VerifyEmail = async (req, res, next) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({
                success: false,
                message: "Required fields are missing or empty.",
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found.",
            });
        }

        // If user is already verified
        if (user.isVerified) {
            return res.status(200).json({
                success: true,
                message: "User is already verified.",
            });
        }

        const emailVerification = await EmailVerification.findOne({ userId: user._id });

        // If no OTP record found, resend OTP
        if (!emailVerification) {
            await sendEmailVerifyOTP(req, user);
            return res.status(400).json({
                success: false,
                message: "OTP not found or expired. A new OTP has been sent to your email.",
            });
        }

        // Check if OTP is valid using argon2
        const isValidOTP = emailVerification.otp === otp;


        if (!isValidOTP) {
            return res.status(400).json({
                success: false,
                message: "Invalid OTP.",
            });
        }

        // Mark user as verified
        user.isVerified = true;
        await user.save();

        // Delete the OTP record after successful verification
        await EmailVerification.deleteOne({ _id: emailVerification._id });

        return res.status(200).json({
            success: true,
            message: "Email verified successfully.",
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
                secure: true,         // set true in production (HTTPS)
                sameSite: 'strict',
                maxAge: 15 * 60 * 1000, // 15 minutes
            })
            .cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: true,
                sameSite: 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
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

    }
}

export const Logout = async (req, res, next) => {
    try {
        return res.clearCookie('accessToken', {
            httpOnly: true,
            secure: true,         // set true in production (HTTPS)
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
        const userId = req.id
        const { name, email, profilePicture } = req.body
        const file = req.file;
        console.log(req.body);
        
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

        let profilePictureUrl = null

        if (name) user.name = name;
        if (email) user.email = email;
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
                name: user.name,
                email: user.email,
                profilePicture: user.profilePicture,

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
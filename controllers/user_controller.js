import argon2 from "argon2"
import { User } from "../models/user_schema.js";
import sendEmailVerifyOTP from "../utils/sendEmailVerifyOTP.js";
import { EmailVerification } from "../models/otp_schema.js";
import { generateToken } from "../utils/generateToken.js";
import fs from "fs";
import imagekit from "../utils/imagekit.js";
import jwt from "jsonwebtoken";

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

        await user.save();

        sendEmailVerifyOTP(req, user);

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

// export const Login = async (req, res, next) => {
//     try {
//         const { email, password } = req.body;
//         if (!email || !password) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Required fields are missing or empty."
//             })
//         }
//         const user = await User.findOne({ email });
//         if (!user) {
//             return res.status(404).json({
//                 success: false,
//                 message: "Invalid email or password."
//             })
//         }
//         const isPasswordValid = await argon2.verify(user.password, password);
//         if (!isPasswordValid) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Invalid email or password."
//             })
//         }

//         const { accessToken, refreshToken } = await generateToken(user);

//         //Set Cookies
//         setCookies(res, { accessToken, refreshToken });
//         //Remove password from user object
//         user.password = undefined;

//         return res.status(200).json({
//             success: true,
//             message: "User logged in successfully.",
//             user: {
//                 id: user._id,
//                 name: user.name,
//                 email: user.email,
//                 role: user.role,
//                 profilePicture: user.profilePicture,
//                 isVerified: true,
//                 accessToken: accessToken,
//                 refreshToken: refreshToken

//             }
//         })

//     } catch (error) {
//         next(error)
//     }
// }









// export const uploadImage = async (req, res) => {
//     try {
//         const file = req.file; // assuming you're using multer
//         if (!file) return res.status(400).json({ message: "No file uploaded" });

//         const uploadedImage = await imagekit.upload({
//             file: fs.readFileSync(file.path), // binary file data
//             fileName: file.originalname, // image name
//             folder: "my_uploads", // optional folder in imagekit
//         });

//         fs.unlinkSync(file.path); // clean up temp file
//         console.log("Uploaded file path:", file.path);

//         res.status(200).json({
//             url: uploadedImage.url,
//             fileId: uploadedImage.fileId,
//         });
//     } catch (error) {
//         console.error("Upload failed:", error);
//         res.status(500).json({ message: "Image upload failed" });
//     }
// };
export const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId);
        if (!user) {
            throw new Error("User not found");
        }
        const { accessToken, refreshToken } = await generateToken(user);

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });
        return { accessToken, refreshToken };

    } catch (error) {
        console.error("Error generating access and refresh token:", error);
        throw new Error("Token generation failed");
    }
}

export const Login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Required fields are missing or empty."
            })
        }
        const user = await User.findOne({ email }).select("+password +isVerified");

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid Credentails."
            })
        }

        const matchPassword = await argon2.verify(user.password, password);

        if (!matchPassword) {
            return res.status(400).json({
                success: false,
                message: "Invalid Credentails."
            })
        }

        if (!user.isVerified) {
            return res.status(400).json({
                success: false,
                message: "User is not verified. Please verify your email.",
            });
        }

        const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id)

        //Set Cookies
        const options = {
            httpOnly: true,
            secure: true,
            expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        };
        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json({
                success: true,
                message: "User logged in successfully.",
                accessToken: accessToken,
                refreshToken: refreshToken,
                user
            })

    } catch (error) {
        next(error)
    }
}

export const Logout = async (req, res, next) => {
    try {
        const { refreshToken } = req.cookies;
        if (!refreshToken) {
            return res.status(400).json({
                success: false,
                message: "No refresh token provided."
            })
        }
        await User.findOneAndUpdate({ refreshToken }, { $set: { refreshToken: null } }, { new: true });
        // Clear cookies    
        res.clearCookie("accessToken");
        res.clearCookie("refreshToken");
        return res.status(200).json({
            success: true,
            message: "User logged out successfully."
        })
    } catch (error) {
        next(error);
    }
}

export const refreshAcessToken = async (req, res, next) => {
    try {
        const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

        if (incomingRefreshToken) {
            return res.status(400).json({
                message: "Unauthorized Request"
            })
        }

        const decodeToken = jwt.verify(incomingRefreshToken, process.env.JWT_REFRESH_SECRET_KEY)
        console.log("Decode TOkne", decodeToken);

        const user = await User.findById(decodeToken?._id)
        if (!user) {
            return res.status(400).json({
                message: "invalid refresh token"
            })
        }
        if (incomingRefreshToken !== user?.refreshToken) {
            return res.status(400).json({
                message: "invalid refresh token"
            })
        }

        const options = {
            httpOnly: true,
            secure: true,
            expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        };

        const { accessToken, newRefreshToken } = await generateAccessAndRefreshToken(user._id)

        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", newRefreshToken, options)
            .json({
                success: true,
                message: "Access Token Refreshed",
                accessToken: accessToken,
                refreshToken: newRefreshToken,
                user
            })

    } catch (error) {
        console.error("Error Refreshing access and refresh token:", error);
        throw new Error("Token Refreshing failed");
    }
}

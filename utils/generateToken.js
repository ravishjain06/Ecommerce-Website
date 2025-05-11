import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { User } from '../models/user_schema.js';
dotenv.config();


export const generateToken = async (user) => {
    try {
        const payload = {
            id: user._id,
            roles: user.role
        }
        const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET_KEY, {
            expiresIn: '100s'
        });

        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET_KEY, {
            expiresIn: '5d'
        });

        await User.findByIdAndUpdate(user._id, { refreshToken });

        return Promise.resolve({
            accessToken,
            refreshToken
        });

    } catch (error) {
        console.error("Error generating token:", error);
        throw new Error("Token generation failed");
    }
}
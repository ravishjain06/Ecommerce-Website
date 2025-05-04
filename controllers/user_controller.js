import argon2 from "argon2"
import { User } from "../models/user_schema.js";

export const Register = async (req, res, next) => {
    try {
        const { name, email, password, role, } = req.body;

        if (!name || !email || !password || !role) {
            return res.status(400).json({
                success: false,
                message: "Required fields are missing or empty."
            })
        }
        const userExits = await User.findOne({ email });

        if (userExits) {
            return res.status(400).json({
                success: false,
                message: "User with this email already exists."
            })
        }

        const hashPassword = await argon2.hash(password);

        const user = await User.create({
            name,
            email,
            password: hashPassword,
            role
        })
        await user.save()

        return res.status(201).json({
            success: true,
            message: "User registered successfully.",
            user
        })
    } catch (error) {
        next(error)
    }
}

export const Login = async (req, res, next) => {
    try {

    } catch (error) {
        next(error)
    }
}


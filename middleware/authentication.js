import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();


export const Authentication = (req, res, next) => {
    try {
        const token = req.cookies?.accessToken || req.headers?.authorization?.split(" ")[1];
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized access. No token provided."
            });
        }
        const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET_KEY);

        if (!decoded) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized access. Invalid token."
            });
        }
        console.log("Decode", decoded);
        req.user = decoded;
        console.log("User Auth", req.user);
        
        req.id = decoded.userId;
        req.role = decoded.roles;
        next();
    } catch (error) {
        console.error("Authentication error:", error);
        return res.status(401).json({
            success: false,
            message: "Unauthorized access. Token verification failed."
        });
    }
}
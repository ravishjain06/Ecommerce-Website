import jwt from "jsonwebtoken";


export function generateAccessToken(user) {
    return jwt.sign(
        {
            id: user._id.toString(), // always a string!
            role: user.role
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '1h' }
    )
}

export function generateRefreshToken(user) {
    return jwt.sign(
        { id: user._id.toString(), role: user.role },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: '7d' }
    )
}
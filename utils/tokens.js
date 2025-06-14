import jwt from "jsonwebtoken";


export function generateAccessToken(user) {
    return jwt.sign(
        {
            id: user.id,
            role: user.role
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '2h' }
    )
}

export function generateRefreshToken(user) {
    return jwt.sign(
        { id: user.id , role: user.role},
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: '7d',
        }
    )
}
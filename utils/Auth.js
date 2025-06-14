import jwt from 'jsonwebtoken';

export const isUserAuthenticated = (req, res, next) => {
    try {
        const { accessToken } = req.cookies;
        if (!accessToken) {
            return res.status(401).json({
                success: false,
                message: 'Access token is missing or invalid.'
            });
        }
        const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);

        if (!decoded) {
            return res.status(401).json({
                success: false,
                message: 'Access token not matched.'
            });
        }
        req.id = decoded.id;
        req.role = decoded.role;
        console.log('User authenticated:', req.id);
        next();
    } 
    catch (error) {
        console.error('Authentication error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error during authentication.'
        });
    }
        
}
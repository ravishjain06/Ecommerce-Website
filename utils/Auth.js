import jwt from 'jsonwebtoken';

export const isUserAuthenticated = (req, res, next) => {
    try {
        // 1. Try to get token from Authorization header
        let token;
        const authHeader = req.headers['authorization'];
        if (authHeader && authHeader.startsWith('Bearer ')) {
            token = authHeader.split(' ')[1];
        }
        // 2. Fallback to cookie if header is not present
        else if (req.cookies && req.cookies.accessToken) {
            token = req.cookies.accessToken;
        }

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Access token is missing or invalid.'
            });
        }

        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        if (!decoded) {
            return res.status(401).json({
                success: false,
                message: 'Access token not matched.'
            });
        }
        req.id = decoded.id;
        req.role = decoded.role;
     
        next();
    } 
    catch (error) {
        console.error('Authentication error:', error);
        return res.status(401).json({
            success: false,
            message: 'Access token is missing or invalid.'
        });
    }
};
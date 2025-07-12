import jwt from 'jsonwebtoken';

export const isUserAuthenticated = (req, res, next) => {
    try {
        let token;
        const authHeader = req.headers['authorization'];
        if (authHeader && authHeader.startsWith('Bearer ')) {
            token = authHeader.split(' ')[1];
        }
        // 2. Fallback to cookie if header is not present
        else if (req.cookies && req.cookies.accessToken) {
            token = req.cookies.accessToken;
        }

        console.log('Auth Middleware: token:', token);

        if (!token) {
            console.log('Auth Middleware: No token found');
            return res.status(401).json({
                success: false,
                message: 'Access token is missing or invalid.'
            });
        }

        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        console.log('Auth Middleware: decoded JWT:', decoded);

        if (!decoded) {
            console.log('Auth Middleware: Decoded token is falsy');
            return res.status(401).json({
                success: false,
                message: 'Access token not matched.'
            });
        }

        // Always ensure req.id is a string (robust)
        if (typeof decoded.id === 'string') {
            req.id = decoded.id;
        } else if (Buffer.isBuffer(decoded.id)) {
            req.id = decoded.id.toString('hex');
        } else {
            req.id = String(decoded.id);
        }
        req.role = decoded.role;

        console.log('Auth Middleware: req.id:', req.id, 'req.role:', req.role);

        next();
    }
    catch (error) {
        // console.error('Authentication error:', error);
        return res.status(401).json({
            success: false,
            message: 'Access token is missing or invalid.'
        });
    }
};
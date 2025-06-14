export const isSeller = (req, res, next) => {
    if (req.role !== 'seller') {
        return res.status(403).json({ message: 'Access denied. Seller role required.' });
    }
    next();
}
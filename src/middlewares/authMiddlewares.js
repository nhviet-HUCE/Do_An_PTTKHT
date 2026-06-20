require('dotenv').config();
const jwt=require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ message: 'No token, authorization denied'});
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Invalid token'});
    }
};

const adminMiddleware = (req, res, next) => {
    const role = req.currentUser?.role || req.currentUser?.User_role || req.user?.role || req.user?.User_role;
    if (role !== 'admin') return res.status(403).json({ message: 'Access denied' });
    next();
}
module.exports = { authMiddleware, adminMiddleware };
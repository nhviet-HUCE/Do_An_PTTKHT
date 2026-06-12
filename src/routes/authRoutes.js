const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authMiddleware, adminMiddleware } = require('../middlewares/authMiddlewares');

router.post('/login', authController.login);
router.post('/register', authController.register);
router.get('/protected', authMiddleware, (req, res) => {
    res.json({ message: 'This is a protected route', user: req.user.username });
});
router.get('/admin', authMiddleware, adminMiddleware, (req, res) => {
    res.json({ message: 'This is an admin route', user: req.user.username });
});

module.exports = router;
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');
const { authMiddleware, adminMiddleware } = require('../middlewares/authMiddlewares');

router.post('/login', authController.login);
router.post('/register', authController.register);
router.get('/protected', authMiddleware, userController.loadCurrentUser, (req, res) => {
    res.json({ message: 'This is a protected route', user: req.currentUser.User_name });
});
router.get('/admin', authMiddleware, userController.loadCurrentUser, adminMiddleware, (req, res) => {
    res.json({ message: 'This is an admin route', user: req.currentUser.User_name });
});

module.exports = router;
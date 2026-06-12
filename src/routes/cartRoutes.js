const express=require('express');
const router=express.Router();
const cartController=require('../controllers/cartController');
const { authMiddleware } = require('../middlewares/authMiddlewares');

router.get('/:userId', authMiddleware, cartController.getCartByUserId);
router.post('', authMiddleware, cartController.addToCart);
router.put('/:userId/:productId', authMiddleware, cartController.updateCartItem);
router.delete('/:userId/:productId', authMiddleware, cartController.removeFromCart);

module.exports=router;
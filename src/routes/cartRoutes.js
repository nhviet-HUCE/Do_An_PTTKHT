const express=require('express');
const router=express.Router();
const cartController=require('../controllers/cartController');
const { authMiddleware } = require('../middlewares/authMiddlewares');

router.get('/:username', authMiddleware, cartController.getCartByUsername);
router.post('', authMiddleware, cartController.addToCart);
router.put('/:username/:productId', authMiddleware, cartController.updateCartItem);
router.delete('/:username/:productId', authMiddleware, cartController.removeFromCart);

module.exports=router;
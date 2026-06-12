const express=require('express');
const router=express.Router();
const userController=require('../controllers/userController');

router.get('',userController.getAllUser);
router.get('/:id',userController.getUserById);
router.get('/username/:username',userController.getUserByUsername);
router.post('',userController.createUser);
router.put('/:id',userController.updateUserById);
router.delete('/:id',userController.deleteUser);

module.exports=router;
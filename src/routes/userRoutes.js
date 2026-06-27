const express=require('express');
const router=express.Router();
const userController=require('../controllers/userController');

router.get('',userController.getAllUser);
router.get('/:id',userController.getUserById);
router.get('/username/:username',userController.getUserByUsername);
router.get('/address/:username',userController.getMemberAddress);
router.post('',userController.createUser);
router.post('/username/:username',userController.addMember);
router.put('/:id',userController.updateUserById);
router.put('/address/:username',userController.updateAddress);
router.delete('/:id',userController.deleteUser);

module.exports=router;
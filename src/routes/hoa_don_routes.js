const express = require('express');
const router = express.Router();
const hoa_don_controller = require('../controllers/hoa_don_controller');

router.get('/:tai_khoan', hoa_don_controller.show_buy_his);
router.post('/bill/:tai_khoan', hoa_don_controller.create_bill);
module.exports = router;
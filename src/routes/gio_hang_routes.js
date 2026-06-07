const express = require('express');
const gio_hang_router = express.Router();
const gio_hang_controller = require('../controllers/gio_hang_controller');

gio_hang_router.get('/:tai_khoan', gio_hang_controller.show_cart);

module.exports = gio_hang_router;
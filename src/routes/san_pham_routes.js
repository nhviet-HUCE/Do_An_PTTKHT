const express = require('express');
const san_pham_router = express.Router();
const san_pham_controller = require('../controllers/san_pham_controller');

san_pham_router.get('/:status', san_pham_controller.product_status);
san_pham_router.put('/toggle/:id', san_pham_controller.toggle_product_status);
san_pham_router.post('/add', san_pham_controller.add_product);
san_pham_router.delete('/delete/:id', san_pham_controller.delete_product);
san_pham_router.patch('/modify/:id', san_pham_controller.modify_product);

module.exports = san_pham_router;
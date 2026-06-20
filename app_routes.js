const express=require('express');
const routes=express.Router();
const hoa_don_route=require('./src/routes/hoa_don_routes');
const gio_hang_route = require('./src/routes/gio_hang_routes');
const san_pham_route = require('./src/routes/san_pham_routes');

routes.use('/product',san_pham_route);
routes.use('/invoice',hoa_don_route);
routes.use('/cart',gio_hang_route);
module.exports=routes;
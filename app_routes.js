const express=require('express');
const routes=express.Router();
const hoa_don_route=require('./src/routes/hoa_don_routes');
const gio_hang_route = require('./src/routes/gio_hang_routes');
const san_pham_route = require('./src/routes/san_pham_routes');

routes.use('/san_pham',san_pham_route);
routes.use('/hoa_don',hoa_don_route);
routes.use('/gio_hang',gio_hang_route);
module.exports=routes;
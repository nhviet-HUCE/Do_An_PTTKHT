const express=require('express');
const routes=express.Router();
const hoa_don_route=require('./src/routes/hoa_don_routes');
const gio_hang_route = require('./src/routes/gio_hang_routes');

routes.use('/lich_su_mua_hang',hoa_don_route);
routes.use('/gio_hang',gio_hang_route);
module.exports=routes;
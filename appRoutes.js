const express=require('express');
const routes=express.Router();
const userRoutes=require('./src/routes/userRoutes');
const authRoutes=require('./src/routes/authRoutes');
const cartRoutes=require('./src/routes/cartRoutes');

routes.use('/users',userRoutes);
routes.use('/auth',authRoutes);
routes.use('/cart',cartRoutes);

module.exports=routes;
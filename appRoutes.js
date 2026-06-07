const express=require('express');
const routes=express.Router();
const userRoutes=require('./src/routes/userRoutes');

routes.use('/users',userRoutes);

module.exports=routes;
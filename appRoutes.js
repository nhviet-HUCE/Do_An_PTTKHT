const express=require('express');
const routes=express.Router();
const userRoutes=require('./src/routes/userRoutes');
const authRoutes=require('./src/routes/authRoutes');
const cartRoutes=require('./src/routes/cartRoutes');
const invoiceRoutes=require('./src/routes/invoiceRoutes');
const productRoutes=require('./src/routes/productRoutes');

routes.use('/users',userRoutes);
routes.use('/auth',authRoutes);
routes.use('/cart',cartRoutes);
routes.use('/products',productRoutes);
routes.use('/invoices',invoiceRoutes);

module.exports=routes;
const express = require('express');
const app = express();
const routes=require('./appRoutes');

app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use('/api/v1',routes);

module.exports=app;
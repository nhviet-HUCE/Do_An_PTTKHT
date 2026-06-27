const express = require('express');
const cors = require('cors');
const app = express();
const routes=require('./appRoutes');

app.use(cors({origin:'http://127.0.0.1:5500',credentials:true}));
app.use(express.urlencoded({limit: '50mb',extended:true}));
app.use(express.json({ limit: '50mb' }));
app.use('/api',routes);

module.exports=app;
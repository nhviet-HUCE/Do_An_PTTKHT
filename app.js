const express = require('express');
const app = express();
const routes=require('./app_routes');

app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use('/api/v1',routes);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server chạy ở http://localhost:${PORT}`);
});

module.exports=app;
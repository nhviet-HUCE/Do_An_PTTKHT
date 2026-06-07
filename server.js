require('dotenv').config()
const app=require('./app')
const db=require('./config/db');
const port = process.env.PORT ||3000;

app.use((req,res)=>{
  res.status(404).send({url:req.originalUrl +' not found'});
})
// Start the server
db.connect();
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

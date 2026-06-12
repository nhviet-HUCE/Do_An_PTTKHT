const db=require('../../config/db');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
exports.login=async(req,res,next)=>{
    try {
        const {User_name,User_password}=req.body;
        const sql='select * from user where User_name=?';
        const user=await db.query(sql,[User_name]);
        if(!user) return res.status(404).json({message:'User not found'});

        const isMatch=await bcrypt.compare(User_password,user[0].User_password);
        if(!isMatch) return res.status(401).json({message:'Invalid credentials'});

        const token=jwt.sign({id:user[0].id},process.env.JWT_SECRET,{expiresIn:'1h'});
        res.json({user:user[0],token:token});
    } catch (err) {
        next(err);
    }
}
exports.register=async(req,res,next)=>{
    try {
        const {User_name,User_password}=req.body;
        const hashedPassword=await bcrypt.hash(User_password,4);
        const sql='insert into user (User_name,User_password) values (?,?)';
        await db.execute(sql,[User_name,hashedPassword]);
        res.json({message:'User registered successfully'});
    } catch (err) {
        next(err);
    }
}
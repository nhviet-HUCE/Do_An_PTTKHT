const db=require('../../config/db');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
exports.login=async(req,res,next)=>{
    try {
        const {Phone_num,User_password}=req.body;
        const sql='select * from user where phone_num=?';
        const user=await db.query(sql,[Phone_num]);
        if(!user.length) return res.status(404).json({message:'Tài khoản không tồn tại'});
        const isMatch=await bcrypt.compare(User_password,user[0].User_password);
        if(!isMatch) return res.status(401).json({message:'Mật khẩu không đúng'});

        const token=jwt.sign({id:user[0].id},process.env.JWT_SECRET,{expiresIn:'1h'});
        res.json({user:user[0],token:token});
    } catch (err) {
        next(err);
    }
}
exports.register=async(req,res,next)=>{
    try {
        const {User_name,full_name,phone_number,User_password}=req.body;
        const existingUser=await db.query('select * from user where phone_num=?',[phone_number]);
        if(existingUser.length>0) {
            return res.status(400).json({message:'Tài khoản đã tồn tại'})};
        const hashedPassword=await bcrypt.hash(User_password,4);
        const sql='insert into user (User_name,name,phone_num,User_password) values (?,?,?,?)';
        await db.execute(sql,[User_name,full_name,phone_number,hashedPassword]);
        res.json({message:'Tài khoản đã được đăng ký thành công'});
    } catch (err) {
        next(err);
    }
}
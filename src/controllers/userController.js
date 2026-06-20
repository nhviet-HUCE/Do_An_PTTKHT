const util = require('util');
const mysql = require('mysql2');
const db = require('../../config/db');

exports.getAllUser = async (req, res, next) => {
    try {
        const sql = "select * from user";
        const users = await db.query(sql);
        res.json(users);
    } catch (err) {
        next(err);
    }
};
exports.getUserById = async (req, res, next) => {
    try {
        const sql = 'select * from user where id=?';
        const user = await db.query(sql, [req.params.id]);
        if (!user || user.length === 0) return res.status(404).json({ message: 'User not found' });
        res.json(user[0]);
    } catch (err) {
        console.error(err);
        next(err);
    }
};
exports.getCurrentUser = async (req, res, next) => {
    try {
        if (!req.currentUser) {
            const sql = 'select * from user where id=?';
            const user = await db.query(sql, [req.user.id]);
            if (!user || user.length === 0) return res.status(404).json({ message: 'User not found' });
            req.currentUser = user[0];
        }
        res.json(req.currentUser);
    } catch (err) {
        console.error(err);
        next(err);
    }
};

exports.loadCurrentUser = async (req, res, next) => {
    try {
        const sql = 'select * from user where id=?';
        const user = await db.query(sql, [req.user.id]);
        if (!user || user.length === 0) return res.status(404).json({ message: 'User not found' });
        req.currentUser = user[0];
        next();
    } catch (err) {
        console.error(err);
        next(err);
    }
};
exports.getUserByUsername = async (req, res, next) => {
    try {
        const sql = 'select * from user where User_name=?';
        const user = await db.query(sql, [req.params.username]);
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user[0]);
    } catch (err) {
        next(err);
    }
};
exports.updateUserById = async (req, res, next) => {
    try {
        const {User_name,User_password} = req.body;
        const userId = req.params.id;
        res.json({res:[User_name,User_password,userId]});
        const sql = 'update user set User_name= ?, User_password= ? where id= ?';
        await db.execute(sql, [User_name, User_password, userId]);
        res.json({ message: "update success" });
    } catch (err) {
        next(err);
    }
};
exports.createUser = async (req, res, next) => {
    try {
        const {id,User_name,User_password} = req.body;
        const sql = 'insert into user (id,User_name,User_password) values (?,?,?)';
        await db.execute(sql, [id,User_name,User_password]);
        res.json({ message: "post success" });

    } catch (err) {
        next(err);
    }
};
exports.deleteUser = async (req, res, next) => {
    try {
        const sql = 'delete from user where id=?';
        db.execute(sql, [req.params.id])
        res.json({ message: "delete success" });
    } catch (err) {
        next(err)
    }
};

'use strict'
const util = require('util');
const mysql = require('mysql2');
const database = require('../../config/db');

// Viết thử cái hàm xem lịch sử mua hàng
exports.show_cart = async (req, res, next) => {
    try {
            const taiKhoan = req.params.tai_khoan;
    
            const sql = `
                SELECT * 
                FROM gio_hang 
                WHERE tai_khoan = ?
            `;
    
            const gio_hang = await database.query(sql, [taiKhoan]);
            console.log("RESULT:", gio_hang);
    
            if (!gio_hang || gio_hang.length === 0) {
                return res.status(404).json({
                    message: `Không tìm thấy giỏ hàng cho tài khoản ${taiKhoan}`
                });
            }
    
            res.json(gio_hang);
        } catch (err) {
            next(err);
        }
};
'use strict'
const util = require('util');
const mysql = require('mysql2');
const database = require('../../config/db');

// Viết thử cái hàm xem lịch sử mua hàng
exports.show_buy_his = async (req, res, next) => {
    try {
        const taiKhoan = req.params.tai_khoan;

        const sql = `
            SELECT * 
            FROM hoa_don 
            WHERE tai_khoan = ?
        `;

        const hoaDon = await database.query(sql, [taiKhoan]);

        if (!hoaDon || hoaDon.length === 0) {
            return res.status(404).json({
                message: `Không tìm thấy hóa đơn cho tài khoản ${taiKhoan}`
            });
        }

        res.json(hoaDon);
    } catch (err) {
        next(err);
    }
};
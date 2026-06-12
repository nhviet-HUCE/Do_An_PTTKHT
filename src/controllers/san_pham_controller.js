'use strict'
const util = require('util');
const mysql = require('mysql2');
const database = require('../../config/db');

// Cái cập nhật trạng thái hiển thị sản phẩm này viết sai rồi 
// Cái này là để lấy sản phẩm theo trạng thái hiển thị thôi 
// Chứ không phải cập nhật trạng thái hiển thị
exports.product_status = async (req, res, next) => {
    try {
        const status = req.params.status;

        const sql = "SELECT * FROM test_pttk.hang_hoa where trang_thai = ?";
        const [rows] = await database.execute(sql, [status]);
        console.log("RESULT:", rows);
        if (!rows || rows.length === 0) {
            return res.status(404).json({
                message: `Không tìm thấy sản phẩm với trạng thái ${status}`
            });
        }
        res.json(rows);
    } catch (err) {
        next(err);
    }
};

exports.toggle_product_status = (req, res, next) => {
    const id = req.params.id;

    const sql = `
        UPDATE test_pttk.hang_hoa
        SET trang_thai = NOT trang_thai
        WHERE ma_san_pham = ?
    `;

    database.execute(sql, [id], (err, result) => {
        if (err) {
            console.error("ERROR:", err);
            return res.status(500).json({ error: err.message });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Không tìm thấy sản phẩm"
            });
        }

        res.json({
            success: true,
            message: "Chuyển trạng thái thành công"
        });
    });
};
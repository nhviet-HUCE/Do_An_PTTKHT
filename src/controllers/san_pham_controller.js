'use strict'
const util = require('util');
const database = require('../../config/db');
const { error } = require('console');

// Cái product_status này chỉ chọn thôi, toogle ở dưới mới là sửa
exports.product_status = async (req, res) => {
    try {
        const status = req.params.status;

        const rows = await database.query(
            "SELECT * FROM test_pttk.hang_hoa WHERE trang_thai = ?",
            [status]
        );

        if (!rows || rows.length === 0) {
            return res.status(404).json({
                message: `Không tìm thấy sản phẩm với trạng thái ${status}`
            });
        }

        return res.json(rows);

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: err.message });
    }
};


exports.toggle_product_status = async (req, res) => {
    try {
        const id = req.params.id;

        const result = await database.execute(
            `UPDATE test_pttk.hang_hoa
             SET trang_thai = NOT trang_thai
             WHERE ma_san_pham = ?`,
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Không tìm thấy sản phẩm"
            });
        }

        return res.json({
            success: true,
            message: "Chuyển trạng thái thành công"
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: err.message });
    }
};

exports.delete_product = async (req, res) => {
    try {
        const id = req.params.id;

        const result = await database.execute(
            "DELETE FROM test_pttk.hang_hoa WHERE ma_san_pham = ?",
            [id]
        );

        if (result.affectedRows === 0) {
            return res.json({
                success: false,
                message: "Không tìm thấy sản phẩm"
            });
        }

        return res.json({
            success: true,
            message: "Xóa sản phẩm thành công"
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: err.message });
    }
};

exports.modify_product = async (req, res) => {
    try {
        const id = req.params.id;
        const data = req.body;

        const allowedFields = [
            "ten",
            "so_luong",
            "gia_tien",
            "the_loai",
            "mo_ta",
            "trang_thai"
        ];

        let fields = [];
        let values = [];

        for (let key in data) {
            if (allowedFields.includes(key)) {
                fields.push(`${key} = ?`);
                values.push(data[key]);
            }
        }

        if (fields.length === 0) {
            return res.json({
                success: false,
                message: "Không có field hợp lệ"
            });
        }

        const sql = `
            UPDATE test_pttk.hang_hoa
            SET ${fields.join(", ")}
            WHERE ma_san_pham = ?
        `;

        values.push(id);

        const result = await database.execute(sql, values);

        if (result.affectedRows === 0) {
            return res.json({
                success: false,
                message: "Không tìm thấy sản phẩm"
            });
        }

        return res.json({
            success: true,
            message: "Cập nhật thành công"
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: err.message });
    }
};
exports.add_product = async (req, res) => {
    try {
        const {
            ma_san_pham,
            ten,
            so_luong,
            gia_tien,
            the_loai,
            mo_ta,
            trang_thai
        } = req.body;

        
        if (!ma_san_pham || !ten || !so_luong || !gia_tien) {
            return res.status(400).json({
                success: false,
                message: "Thiếu dữ liệu bắt buộc"
            });
        }

        
        const rows = await database.query(
            "SELECT ma_san_pham FROM test_pttk.hang_hoa WHERE ma_san_pham = ?",
            [ma_san_pham]
        );

        if (rows.length > 0) {
            return res.status(400).json({
                success: false,
                message: `Mã sản phẩm ${ma_san_pham} đã tồn tại`
            });
        }

        
        const result = await database.execute(
            `INSERT INTO test_pttk.hang_hoa
             (ma_san_pham, ten, so_luong, gia_tien, the_loai, mo_ta, trang_thai)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [ma_san_pham, ten, so_luong, gia_tien, the_loai, mo_ta, trang_thai]
        );

        return res.json({
            success: true,
            message: "Thêm sản phẩm thành công"
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: err.message });
    }
};
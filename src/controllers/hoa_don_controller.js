'use strict'
const util = require('util');
const database = require('../../config/db');


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

exports.create_bill = async (req, res, next) => {
    try {
        const taiKhoan = req.params.tai_khoan;
        const { thong_tin_khach_hang, gia_tien, chi_tiet } = req.body;

        // ===== 1. Hàm random 5 số =====
        const random5 = () => Math.floor(10000 + Math.random() * 90000);

        // ===== 2. Sinh dữ liệu =====
        const maHoaDon = "HD" + random5();
        const maVanDon = "VD" + random5();
        const thoi_gian_mua_hang = new Date();

        const finalGiaTien = gia_tien || 0;
        const thongTinKH = thong_tin_khach_hang || "Khách test";

        // ===== 3. Insert bảng hóa đơn =====
        const sqlInsertHoaDon = `
            INSERT INTO hoa_don
            (ma_hoa_don, tai_khoan, thoi_gian_mua_hang, gia_tien,
             thong_tin_khach_hang, ma_van_don, dia_chi_sieu_thi, trang_thai)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;

        await database.query(sqlInsertHoaDon, [
            maHoaDon,
            taiKhoan,
            thoi_gian_mua_hang,
            finalGiaTien,
            thongTinKH,
            maVanDon,
            "Hà Nội",
            "Chờ"
        ]);

        // ===== 4. Insert chi tiết (nếu có) =====
        if (Array.isArray(chi_tiet)) {
            const sqlInsertCT = `
                INSERT INTO dong_hang_hoa
                (ma_hoa_don, ma_san_pham, so_luong)
                VALUES (?, ?, ?)
            `;

            for (const item of chi_tiet) {
                await database.query(sqlInsertCT, [
                    maHoaDon,
                    item.ma_san_pham,
                    item.so_luong
                ]);
            }
        }

        // ===== 5. Response =====
        res.status(201).json({
            message: "Tạo hóa đơn thành công",
            data: {
                ma_hoa_don: maHoaDon,
                thoi_gian_mua_hang: thoi_gian_mua_hang,
                ma_van_don: maVanDon,
                tai_khoan: taiKhoan,
                gia_tien: finalGiaTien,
                trang_thai: "Chờ"
            }
        });

    } catch (err) {
        next(err);
    }
};

exports.xu_ly_don_hang = async (req, res) => {
    try {
        const { ma_hoa_don, trang_thai } = req.body;
        const rows = await database.query(
            "SELECT * FROM test_pttk.hoa_don WHERE ma_hoa_don = ? AND trang_thai = 'Chờ'",
            [ma_hoa_don]
        );

        if (!rows || rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy hóa đơn hoặc trạng thái không hợp lệ"
            });
        }

        
        if (trang_thai === "chap_nhan") {
            
            await database.execute(
                "UPDATE test_pttk.hoa_don SET trang_thai = 'Chấp nhận' WHERE ma_hoa_don = ?",
                [ma_hoa_don]
            );

            return res.json({
                success: true,
                message: "Đã chấp nhận đơn hàng"
            });

        } else if (trang_thai === "huy") {
            
            await database.execute(
                "UPDATE test_pttk.hoa_don SET trang_thai = 'Hủy' WHERE ma_hoa_don = ?",
                [ma_hoa_don]
            );

            return res.json({
                success: true,
                message: "Đã hủy đơn hàng"
            });

        } else {
            return res.status(400).json({
                success: false,
                message: "Action không hợp lệ (chap_nhan | huy)"
            });
        }

    } catch (err) {
        console.error(err);
        return res.status(500).json({
            error: err.message
        });
    }
};
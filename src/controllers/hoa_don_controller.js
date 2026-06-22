'use strict'
const util = require('util');
const database = require('../../config/db');


exports.show_user_bills = async (req, res, next) => {
    try {
        const account = req.params.User_name;

        const sql = `
            SELECT * 
            FROM invoice 
            WHERE User_name = ?
        `;

        const hoaDon = await database.query(sql, [account]);

        if (!hoaDon || hoaDon.length === 0) {
            return res.status(404).json({
                message: `Không tìm thấy hóa đơn cho tài khoản ${account}`
            });
        }

        res.json(hoaDon);
    } catch (err) {
        next(err);
    }
};

exports.create_bill = async (req, res, next) => {
    try {
        const account = req.params.User_name;
        const { thong_tin_khach_hang, gia_tien, chi_tiet, dc_shop } = req.body;

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
            INSERT INTO invoice
            (Inv_id, User_name, created_At, Inv_price,
             Cus_info, Track_num, shop_address, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;

        await database.execute(sqlInsertHoaDon, [
            maHoaDon,
            account,
            thoi_gian_mua_hang,
            finalGiaTien,
            thongTinKH,
            maVanDon,
            dc_shop,
            "Chờ"
        ]);

        // ===== 4. Insert chi tiết (nếu có) =====
        if (Array.isArray(chi_tiet)) {
            const sqlInsertCT = `
                INSERT INTO line
                (Inv_id, Prod_id, quantity)
                VALUES (?, ?, ?)
            `;

            for (const item of chi_tiet) {
                await database.execute(sqlInsertCT, [
                    maHoaDon,
                    item.Prod_id,
                    item.quantity
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
                tai_khoan: account,
                gia_tien: finalGiaTien,
                trang_thai: "Chờ"
            }
        });

    } catch (err) {
        next(err);
    }
};

exports.update_pending_bills = async (req, res) => {
    try {
        const { ma_hoa_don, trang_thai } = req.body;
        const rows = await database.query(
            "SELECT * FROM invoice WHERE Inv_id = ? AND status = 'Chờ'",
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
                "UPDATE invoice SET status = 'Chấp nhận' WHERE Inv_id = ?",
                [ma_hoa_don]
            );

            return res.json({
                success: true,
                message: "Đã chấp nhận đơn hàng"
            });

        } else if (trang_thai === "huy") {
            
            await database.execute(
                "UPDATE invoice SET status = 'Hủy' WHERE Inv_id = ?",
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
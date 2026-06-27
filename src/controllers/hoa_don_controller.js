'use strict'
const util = require('util');
const database = require('../../config/db');


exports.show_user_bills = async (req, res, next) => {
    try {
        const account = req.params.User_name;

        const sql = `
            SELECT 
    i.Inv_id,
    p.prod_name,
    p.prod_price,
    prod_img,
    created_At,
    l.prod_id,
    l.quantity,
    inv_price,
    status
FROM Line l
JOIN Product p ON l.Prod_id = p.prod_id
JOIN Invoice i ON l.Inv_id = i.Inv_id where user_name=?
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
exports.show_bill_detail = async (req, res, next) => {
    try {
        const id = req.params.Inv_id;

        const sql = `
            SELECT 
    i.Inv_id,
    p.prod_name,
    p.prod_price,
    prod_img,
    l.prod_id,
    l.quantity,
    inv_price,
    status
FROM Line l
JOIN Product p ON l.Prod_id = p.prod_id
JOIN Invoice i ON l.Inv_id = i.Inv_id where i.Inv_id=?
        `;

        const hoaDon = await database.query(sql, [id]);

        if (!hoaDon || hoaDon.length === 0) {
            return res.status(404).json({
                message: `Không tìm thấy hóa đơn cho mã ${id}`
            });
        }

        res.json(hoaDon);
    } catch (err) {
        next(err);
    }
};
exports.show_all_bills = async (req, res, next) => {
    try {
        const sql = `
            SELECT * 
            FROM invoice
        `;

        const hoaDon = await database.query(sql);

        if (!hoaDon || hoaDon.length === 0) {
            return res.status(404).json({
                message: "Không tìm thấy hóa đơn"
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
            '123 trương định',
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
exports.delete_bill = async (req, res, next) => {
    try {
        const invId = req.params.Inv_id;

        // Kiểm tra xem hóa đơn có status là "Chờ" không
        const invoice = await database.query('SELECT * FROM invoice WHERE Inv_id = ?', [invId]);

        if (!invoice || invoice.length === 0) {
            return res.status(404).json({ message: 'Hóa đơn không tồn tại' });
        }

        if (invoice[0].status !== 'Chờ') {
            return res.status(400).json({ message: 'Chỉ có thể hủy đơn có trạng thái "Chờ"' });
        }

        // Lấy thông tin sản phẩm trong đơn hàng để xóa trong cart
        const lineItems = await database.query('SELECT * FROM line WHERE Inv_id = ?', [invId]);

        // Xóa từng sản phẩm khỏi cart (nếu còn)
        for (const item of lineItems) {
            await database.execute('DELETE FROM cart WHERE prod_id = ?', [item.Prod_id]);
        }

        // Xóa chi tiết hóa đơn (bảng line)
        await database.execute('DELETE FROM line WHERE Inv_id = ?', [invId]);

        // Xóa hóa đơn
        await database.execute('DELETE FROM invoice WHERE Inv_id = ?', [invId]);

        res.json({
            message: 'Hủy đơn hàng thành công',
            data: { Inv_id: invId }
        });

    } catch (err) {
        next(err);
    }
};
const db=require('../../config/db');

exports.getCartByUserId = async (req, res, next) => {
    try {
        const sql = `
        SELECT 
            c.User_name,
            c.prod_id,
            c.quantity,
            p.prod_name,
            p.prod_price,
            p.prod_category
        FROM test_pttk.cart c
        JOIN test_pttk.product p ON c.prod_id = p.prod_id
        WHERE c.User_name = ?
        `;

        const cart = await db.query(sql, [req.params.userId]);
        if (!cart) return res.status(404).json({ message: 'Cart not found' });
        res.json(cart);
    } catch (err) {
        next(err);
    }
}
exports.addToCart = async (req, res, next) => {
    try {
        const {user_id, product_id, quantity} = req.body;
        const sql = 'insert into cart (user_id, product_id, quantity) values (?, ?, ?)';
        const result = await db.query(sql, [user_id, product_id, quantity]);
        res.status(201).json({ message: 'Item added to cart', cartId: result.insertId });
    } catch (err) {
        next(err);
    }
};
exports.updateCartItem = async (req, res, next) => {
    try {        
        const {quantity} = req.body;
        const productId = req.params.productId;
        const sql = 'update cart set quantity=? where product_id=? and user_id=?';
        await db.execute(sql, [quantity, productId, req.params.userId]);
        res.json({ message: 'Cart item updated' });
    } catch (err) {
        next(err);
    }
};
exports.removeFromCart = async (req, res, next) => {
    try {
        const productId = req.params.productId;
        const sql = 'delete from cart where product_id=? and user_id=?';
        await db.execute(sql, [productId, req.params.userId]);
        res.json({ message: 'Cart item removed' });
    } catch (err) {
        next(err);
    }
};

exports.updateQty = async (req, res, next) => {
    try {
        const { prod_id, change } = req.body;
        // Lấy số lượng hiện tại
        const selectSql = 'SELECT quantity FROM cart WHERE prod_id = ?';
        const result = await db.query(selectSql, [prod_id]);
        
        if (!result || result.length === 0) {
            return res.status(404).json({ message: 'Product not in cart' });
        }

        let newQuantity = result[0].quantity + change;
        
        // Nếu số lượng <= 0 thì xóa khỏi giỏ
        if (newQuantity <= 0) {
            const deleteSql = 'DELETE FROM cart WHERE prod_id = ?';
            await db.execute(deleteSql, [prod_id]);
            return res.json({ message: 'Item removed from cart' });
        }

        // Cập nhật số lượng
        const updateSql = 'UPDATE cart SET quantity = ? WHERE prod_id = ?';
        await db.execute(updateSql, [newQuantity, prod_id]);
        res.json({ message: 'Cart quantity updated', quantity: newQuantity });
    } catch (err) {
        next(err);
    }
};

exports.deleteCartItem = async (req, res, next) => {
    try {
        const { prod_id } = req.body;
        const sql = 'DELETE FROM cart WHERE prod_id = ?';
        await db.execute(sql, [prod_id]);
        res.json({ message: 'Item removed from cart' });
    } catch (err) {
        next(err);
    }
};

const db=require('../../config/db');

exports.getCartByUserId = async (req, res, next) => {
    try {
        const sql = 'select * from cart where user_id=?';
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

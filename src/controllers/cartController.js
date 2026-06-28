const db=require('../../config/db');

exports.getCartByUsername = async (req, res, next) => {
    try {
        const sql = 'select c.prod_id,prod_img,prod_name,prod_price,prod_category,quantity from product p inner join cart c on p.prod_id=c.prod_id where User_name=?';
        const cart = await db.query(sql, [req.params.username]);
        if (!cart) return res.status(404).json({ message: 'Cart not found' });
        res.json(cart);
    } catch (err) {
        next(err);
    }
}
exports.addToCart = async (req, res, next) => {
    try {
        const {User_name, Product_id, Quantity} = req.body;
        const sql = 'insert into cart (User_name, Prod_id, Quantity) values (?, ?, ?)';
        const result = await db.query(sql, [User_name, Product_id, Quantity]);
        res.status(201).json({ message: 'Item added to cart', cartId: result.insertId });
    } catch (err) {
        next(err);
    }
};
exports.updateCartItem = async (req, res, next) => {
    try {        
        const {username,quantity} = req.body;
        const productId = req.params.productId;
        const sql = 'update cart set quantity=? where prod_id=? and user_name=?';
        await db.execute(sql, [quantity, productId, username]);
        res.json({ message: 'Cart item updated' });
    } catch (err) {
        next(err);
    }
};
exports.removeCart = async (req, res, next) => {
    try {
        const sql = 'delete from cart where user_name=?';
        await db.execute(sql, [req.params.username]);
        res.json({ message: 'Cart removed' });
    } catch (err) {
        next(err);
    }
};
exports.removeFromCart = async (req, res, next) => {
    try {
        const productId = req.params.productId;
        const sql = 'delete from cart where prod_id=? and user_name=?';
        await db.execute(sql, [productId, req.params.username]);
        res.json({ message: 'Cart item removed' });
    } catch (err) {
        next(err);
    }
};

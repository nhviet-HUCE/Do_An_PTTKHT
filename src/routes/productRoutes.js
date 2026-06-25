const express = require("express");
const router = express.Router();
const productController = require("../controllers/san_pham_controller");

router.get("", productController.get_all_products);
router.get("/status/:status", productController.get_product_status);
router.get("/search/:keyword", productController.get_product_by_keyword);
router.get("/category/:category", productController.get_product_by_category);
router.put("/toggle/:id", productController.toggle_product_status);
router.put("/:id", productController.modify_product);
router.post("", productController.add_product);
router.delete("/:id", productController.delete_product);
router.get("/:id", productController.get_product_by_id);
module.exports = router;
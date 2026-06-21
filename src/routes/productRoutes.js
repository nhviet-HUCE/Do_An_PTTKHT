const express = require("express");
const router = express.Router();
const productController = require("../controllers/san_pham_controller");

router.get("", productController.get_all_products);
router.get("/status/:status", productController.get_product_status);
router.put("/toggle/:id", productController.toggle_product_status);
router.put("/:id", productController.modify_product);
router.post("", productController.add_product);
router.delete("/:id", productController.delete_product);

module.exports = router;
const express = require("express");
const router = express.Router();
const invoiceController = require("../controllers/hoa_don_controller");

router.get("/user/:User_name", invoiceController.show_user_bills);
router.get("/", invoiceController.show_all_bills);
router.patch("/pending", invoiceController.update_pending_bills);
router.post("/:User_name", invoiceController.create_bill);

module.exports = router;
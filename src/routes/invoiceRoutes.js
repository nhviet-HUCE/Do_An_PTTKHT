const express = require("express");
const router = express.Router();
const invoiceController = require("../controllers/hoa_don_controller");

router.get("/user/:User_name", invoiceController.show_user_bills);
router.patch("/pending", invoiceController.update_pending_bills);
router.post("/:User_name", invoiceController.create_bill);
router.delete("/:Inv_id", invoiceController.delete_bill);

module.exports = router;
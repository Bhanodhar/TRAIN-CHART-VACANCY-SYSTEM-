const express = require("express");
const router = express.Router();
const { createOrder, verifyPayment } = require("../controllers/paymentController");
const { protect, userOnly } = require("../middleware/authMiddleware");

router.post("/create-order", protect, userOnly, createOrder);
router.post("/verify", protect, userOnly, verifyPayment);

module.exports = router;
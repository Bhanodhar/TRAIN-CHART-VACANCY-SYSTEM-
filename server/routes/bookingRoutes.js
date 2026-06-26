const express = require("express");
const router = express.Router();
const {
  bookTicket,
  getMyBookings,
  cancelTicket,
  getAllBookings,
} = require("../controllers/bookingController");
const { protect, adminOnly, userOnly } = require("../middleware/authMiddleware");

// User routes
router.post("/book", protect, userOnly, bookTicket);
router.get("/mybookings", protect, userOnly, getMyBookings);
router.put("/cancel/:id", protect, userOnly, cancelTicket);

// Admin routes
router.get("/all", protect, adminOnly, getAllBookings);

module.exports = router;
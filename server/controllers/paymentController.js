const Razorpay = require("razorpay");
const crypto = require("crypto");
const Booking = require("../models/Booking");
const Train = require("../models/Train");
const generatePNR = require("../utils/generatePNR");

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// CREATE ORDER
const createOrder = async (req, res) => {
  try {
    const { trainId, boardingStation, destinationStation, seatNumber, compartment } = req.body;

    // Check if train exists
    const train = await Train.findById(trainId);
    if (!train) {
      return res.status(404).json({ message: "Train not found" });
    }

    // Check if seat already booked
    const existingBooking = await Booking.findOne({
      train: trainId,
      seatNumber,
      compartment,
      bookingStatus: "confirmed",
    });
    if (existingBooking) {
      return res.status(400).json({ message: "Seat already booked" });
    }

    // Create Razorpay order
    const order = await razorpay.orders.create({
      amount: train.fare * 100, // Razorpay needs amount in paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      notes: {
        trainId,
        boardingStation,
        destinationStation,
        seatNumber,
        compartment,
        userId: req.user.id,
      },
    });

    res.status(200).json({
      message: "Order created successfully",
      order,
      fare: train.fare,
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// VERIFY PAYMENT AND BOOK TICKET
const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      trainId,
      boardingStation,
      destinationStation,
      seatNumber,
      compartment,
    } = req.body;

    // Verify signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ message: "Payment verification failed" });
    }

    // Payment verified - create booking
    const train = await Train.findById(trainId);

    const pnr = generatePNR();

    const booking = await Booking.create({
      user: req.user.id,
      train: trainId,
      pnr,
      boardingStation,
      destinationStation,
      seatNumber: Number(seatNumber),
      compartment: Number(compartment),
      fare: train.fare,
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
    });

    const populatedBooking = await Booking.findById(booking._id)
      .populate("train", "trainName trainNumber departureTime arrivalTime")
      .populate("user", "name email");

    res.status(201).json({
      message: "Payment successful! Ticket booked.",
      booking: populatedBooking,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { createOrder, verifyPayment };
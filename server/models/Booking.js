const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    train: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Train",
      required: true,
    },
    pnr: {
      type: String,
      required: true,
      unique: true,
    },
    boardingStation: {
      type: String,
      required: true,
    },
    destinationStation: {
      type: String,
      required: true,
    },
    seatNumber: {
      type: Number,
      required: true,
    },
    compartment: {
      type: Number,
      required: true,
    },
    fare: {
      type: Number,
      required: true,
    },
    bookingStatus: {
      type: String,
      enum: ["confirmed", "cancelled"],
      default: "confirmed",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Booking", bookingSchema);
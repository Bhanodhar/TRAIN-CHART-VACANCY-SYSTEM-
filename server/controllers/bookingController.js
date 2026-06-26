const Booking = require("../models/Booking");
const Train = require("..models/Train");
const generatePNR = require("../utils/generatePNR");


const bookTicket = async(req,res)=>{
try
{
    const { trainId, boardingStation, destinationStation, seatNumber, compartment} = req.body;
    //Check if train exists
    const train = await Train.findById(trainId);
    if(!train){
        return res.status(404).json({ message: "Train not found" });
    }

    const existingBooking = await Booking.findOne({
        train:trainId,
        seatNumber, compartment, bookingStatus: "confirmed",
    });
     // Check if seat is already booked on this train
    if(existingBooking){
        return res.status(400).json({ message: "Seat already booked" });
    }
    
    // Validate boarding and destination stations
    const allStations=[
        train.boardingPoint,
        ...train.intermediateStations.map( (s)=> s.stationsName),
        train.destinationPoint,
    ];


    if (!allStations.includes(boardingStation)) {
      return res.status(400).json({ message: "Invalid boarding station" });
    }
    if (!allStations.includes(destinationStation)) {
      return res.status(400).json({ message: "Invalid destination station" });
    }

    // Boarding station should come before destination
    const boardingIndex = allStations.indexOf(boardingStation);
    const destinationIndex = allStations.indexOf(destinationStation);
    if (boardingIndex >= destinationIndex) {
      return res.status(400).json({ message: "Destination must come after boarding station" });
    }

    // Generate unique PNR
    const pnr = generatePNR();

    // Create Booking
    const booking = await Booking.create({
        user:req.user.id,
        train:trainId,
        pnr,
        boardingStation,
        destinationStation,
        seatNumber,
        compartment,
        fare:train.fare,
    });

    // Populate train details in response
    const populatedBooking = await Booking.findById(booking._id)
            .populate("train", "trainName trainNumber departureTime arrivalTime")
            .populate("user", "name email");

    res.status(201).json({
      message: "Ticket booked successfully",
      bookingDetails: populatedBooking,
    });

}
catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};



// GET MY BOOKINGS (User only)
const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id })
      .populate("train", "trainName trainNumber boardingPoint destinationPoint departureTime arrivalTime")
      .sort({ createdAt: -1 });
      if (!bookings) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};



// CANCEL TICKET (User only)
const cancelTicket = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Only the user who booked can cancel
    if (booking.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to cancel this booking" });
    }

    // Check if already cancelled
    if (booking.bookingStatus === "cancelled") {
      return res.status(400).json({ message: "Ticket already cancelled" });
    }

    booking.bookingStatus = "cancelled";
    await booking.save();

    res.status(200).json({ message: "Ticket cancelled successfully", booking });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};



// GET ALL BOOKINGS (Admin only)
const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("user", "name email")
      .populate("train", "trainName trainNumber")
      .sort({ createdAt: -1 });

    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { bookTicket, getMyBookings, cancelTicket, getAllBookings }; 


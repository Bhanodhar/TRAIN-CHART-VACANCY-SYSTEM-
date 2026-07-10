const Booking = require("../models/Booking");
const Train = require("../models/Train");


// CHART VACANCY
const getChartVacancy = async (req, res) => {
  try {
    const { trainId, boardingStation, destinationStation } = req.query;

    // Get train details
    const train = await Train.findById(trainId);
    if (!train) {
      return res.status(404).json({ message: "Train not found" });
    }

    // Build full station list in order
    const allStations = [
      train.boardingPoint,
      ...train.intermediateStations.map((s) => s.stationName),
      train.destinationPoint,
    ];

    // Get user's journey indexes
    const userBoardingIndex = allStations.indexOf(boardingStation);
    const userDestinationIndex = allStations.indexOf(destinationStation);

    if (userBoardingIndex === -1 || userDestinationIndex === -1) {
      return res.status(400).json({ message: "Invalid stations" });
    }

    // Get all confirmed bookings for this train
    const bookings = await Booking.find({
      train: trainId,
      bookingStatus: "confirmed",
    });

    // Build seat map
    const seatMap = [];

    for (let compartment = 1; compartment <= train.totalCompartments; compartment++) {
      const seats = [];

      for (let seat = 1; seat <= train.seatsPerCompartment; seat++) {

        // Find all bookings for this specific seat
        const seatBookings = bookings.filter(
          (b) => b.compartment === compartment && b.seatNumber === seat
        );

        // Check if this seat overlaps with user's journey
        let status = "vacant";
        let segments = [];

        if (seatBookings.length > 0) {
          let fullyOccupied = false;

          for (const booking of seatBookings) {
            const bookingBoardingIndex = allStations.indexOf(booking.boardingStation);
            const bookingDestinationIndex = allStations.indexOf(booking.destinationStation);

            segments.push({
              from: booking.boardingStation,
              to: booking.destinationStation,
              status: "occupied",
            });

            // Check if booking overlaps with user journey
            const overlaps =
              bookingBoardingIndex < userDestinationIndex &&
              bookingDestinationIndex > userBoardingIndex;

            if (overlaps) {
              // Does it cover the FULL user journey?
              const coversFullJourney =
                bookingBoardingIndex <= userBoardingIndex &&
                bookingDestinationIndex >= userDestinationIndex;

              if (coversFullJourney) {
                fullyOccupied = true;
              } else {
                status = "partial";
              }
            }
          }

          if (fullyOccupied) {
            status = "full";
          }
        }

        seats.push({
          seatNumber: seat,
          compartment,
          status,
          segments,
        });
      }

      seatMap.push({
        compartment,
        seats,
      });
    }

    res.status(200).json({
      train: {
        trainName: train.trainName,
        trainNumber: train.trainNumber,
        boardingPoint: train.boardingPoint,
        destinationPoint: train.destinationPoint,
        allStations,
      },
      userJourney: {
        boardingStation,
        destinationStation,
      },
      seatMap,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


module.exports = { getChartVacancy };
import { useState } from "react";
import axiosInstance from "../utils/axiosInstance";

const BookingModal = ({ train, onClose, onSuccess }) => {
  const allStations = [
    train.boardingPoint,
    ...train.intermediateStations.map((s) => s.stationName),
    train.destinationPoint,
  ];

  const [formData, setFormData] = useState({
    boardingStation: "",
    destinationStation: "",
    seatNumber: "",
    compartment: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await axiosInstance.post("/booking/book", {
        trainId: train._id,
        boardingStation: formData.boardingStation,
        destinationStation: formData.destinationStation,
        seatNumber: Number(formData.seatNumber),
        compartment: Number(formData.compartment),
      });
      console.log(response)
      onSuccess(response.data.booking);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-xl font-bold text-gray-800">
              Book Ticket
            </h3>
            <p className="text-sm text-gray-500">
              {train.trainName} #{train.trainNumber}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
          >
            ×
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-100 text-red-600 text-sm px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-gray-700">
              Boarding Station
            </label>
            <select
              name="boardingStation"
              value={formData.boardingStation}
              onChange={handleChange}
              required
              className="border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select boarding station</option>
              {allStations.map((station, index) => (
                <option key={index} value={station}>
                  {station}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-gray-700">
              Destination Station
            </label>
            <select
              name="destinationStation"
              value={formData.destinationStation}
              onChange={handleChange}
              required
              className="border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select destination station</option>
              {allStations.map((station, index) => (
                <option key={index} value={station}>
                  {station}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-4">
            <div className="flex flex-col gap-1 flex-1">
              <label className="text-sm font-semibold text-gray-700">
                Compartment
              </label>
              <select
                name="compartment"
                value={formData.compartment}
                onChange={handleChange}
                required
                className="border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select</option>
                {Array.from(
                  { length: train.totalCompartments },
                  (_, i) => i + 1
                ).map((c) => (
                  <option key={c} value={c}>
                    Compartment {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1 flex-1">
              <label className="text-sm font-semibold text-gray-700">
                Seat Number
              </label>
              <select
                name="seatNumber"
                value={formData.seatNumber}
                onChange={handleChange}
                required
                className="border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select</option>
                {Array.from(
                  { length: train.seatsPerCompartment },
                  (_, i) => i + 1
                ).map((s) => (
                  <option key={s} value={s}>
                    Seat {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Fare Preview */}
          <div className="bg-blue-50 rounded-lg px-4 py-3 text-sm text-blue-700 font-semibold">
            Total Fare: ₹{train.fare}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Booking..." : "Confirm Booking"}
          </button>

        </form>
      </div>
    </div>
  );
};

export default BookingModal;
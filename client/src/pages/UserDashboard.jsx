import { useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";
import Navbar from "../components/Navbar";
import TrainCard from "../components/TrainCard";
import BookingModal from "../components/BookingModal";

const UserDashboard = () => {
  const [trains, setTrains] = useState([]);
  const [myBookings, setMyBookings] = useState([]);
  const [selectedTrain, setSelectedTrain] = useState(null);
  const [activeTab, setActiveTab] = useState("trains");
  const [loading, setLoading] = useState(true);
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    fetchTrains();
    fetchMyBookings();
  }, []);

  const fetchTrains = async () => {
    try {
      const response = await axiosInstance.get("/train");
      // console.log(response);
      // console.log("trains details :" + JSON.stringify(response.data));
      setTrains(response.data.trains);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMyBookings = async () => {
    try {
      const response = await axiosInstance.get("/booking/mybookings");
      console.log(response.data);
      
      setMyBookings(response.data);

    } catch (err) {
      console.error(err);
    }
  };

  const handleBookSuccess = (newBooking) => {
    setSelectedTrain(null);
    setMyBookings([newBooking, ...myBookings]);
    setSuccessMsg("🎉 Ticket booked successfully!");
    setActiveTab("bookings");
    setTimeout(() => setSuccessMsg(""), 4000);
  };

  const handleCancel = async (bookingId) => {
    try {
      await axiosInstance.put(`/booking/cancel/${bookingId}`);
      setMyBookings(
        myBookings.map((b) =>
          b._id === bookingId ? { ...b, bookingStatus: "cancelled" } : b
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 py-8">

        {/* Success Message */}
        {successMsg && (
          <div className="bg-green-100 text-green-700 px-4 py-3 rounded-lg mb-6 font-semibold text-sm">
            {successMsg}
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 mb-8">
          <button
            onClick={() => setActiveTab("trains")}
            className={`px-6 py-2 rounded-lg font-semibold text-sm transition ${
              activeTab === "trains"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-600 hover:bg-gray-50"
            }`}
          >
            🚆 Available Trains
          </button>
          <button
            onClick={() => setActiveTab("bookings")}
            className={`px-6 py-2 rounded-lg font-semibold text-sm transition ${
              activeTab === "bookings"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-600 hover:bg-gray-50"
            }`}
          >
            🎫 My Bookings
          </button>
        </div>

        {/* Trains Tab */}
        {activeTab === "trains" && (
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Available Trains
            </h2>
            {loading ? (
              <p className="text-gray-500">Loading trains...</p>
            ) : trains.length === 0 ? (
              <p className="text-gray-500">No trains available right now.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {trains.map((train) => (
                  <TrainCard
                    key={train._id}
                    train={train}
                    onBook={(train) => setSelectedTrain(train)}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Bookings Tab */}
        {activeTab === "bookings" && (
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              My Bookings
            </h2>
            {myBookings.length === 0 ? (
              <p className="text-gray-500">No bookings yet.</p>
            ) : (
              <div className="flex flex-col gap-4">
                {myBookings.map((booking) => (
                  <div
                    key={booking._id}
                    className="bg-white rounded-2xl shadow-md p-6"
                  >
                    {/* Booking Header */}
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="text-xs text-gray-400 mb-1">PNR Number</p>
                        <p className="text-lg font-bold text-blue-600">
                          {booking.pnr}
                        </p>
                      </div>
                      <span
                        className={`text-xs font-semibold px-3 py-1 rounded-full ${
                          booking.bookingStatus === "confirmed"
                            ? "bg-green-100 text-green-600"
                            : "bg-red-100 text-red-500"
                        }`}
                      >
                        {booking.bookingStatus === "confirmed"
                          ? "✅ Confirmed"
                          : "❌ Cancelled"}
                      </span>
                    </div>

                    {/* Train Details */}
                    <div className="grid grid-cols-2 gap-3 text-sm mb-4">
                      <div>
                        <p className="text-xs text-gray-400">Train</p>
                        <p className="font-semibold text-gray-800">
                          {booking.train?.trainName}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Train No</p>
                        <p className="font-semibold text-gray-800">
                          #{booking.train?.trainNumber}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">From</p>
                        <p className="font-semibold text-gray-800">
                          {booking.boardingStation}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">To</p>
                        <p className="font-semibold text-gray-800">
                          {booking.destinationStation}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Compartment</p>
                        <p className="font-semibold text-gray-800">
                          {booking.compartment}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Seat</p>
                        <p className="font-semibold text-gray-800">
                          {booking.seatNumber}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Fare</p>
                        <p className="font-semibold text-gray-800">
                          ₹{booking.fare}
                        </p>
                      </div>
                    </div>

                    {/* Cancel Button */}
                    {booking.bookingStatus === "confirmed" && (
                      <button
                        onClick={() => handleCancel(booking._id)}
                        className="text-sm text-red-500 border border-red-400 px-4 py-2 rounded-lg hover:bg-red-50 transition font-semibold"
                      >
                        Cancel Ticket
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>

      {/* Booking Modal */}
      {selectedTrain && (
        <BookingModal
          train={selectedTrain}
          onClose={() => setSelectedTrain(null)}
          onSuccess={handleBookSuccess}
        />
      )}

    </div>
  );
};

export default UserDashboard;
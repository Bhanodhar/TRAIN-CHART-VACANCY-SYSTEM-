import { useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";
import Navbar from "../components/Navbar";
import TrainForm from "../components/TrainForm";

const AdminDashboard = () => {
  const [trains, setTrains] = useState([]);
  const [allBookings, setAllBookings] = useState([]);
  const [activeTab, setActiveTab] = useState("trains");
  const [showTrainForm, setShowTrainForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    fetchTrains();
    fetchAllBookings();
  }, []);

  const fetchTrains = async () => {
    try {
      const response = await axiosInstance.get("/train");
      setTrains(response.data.trains || response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllBookings = async () => {
    try {
      const response = await axiosInstance.get("/booking/all");
      // console.log(response);
      setAllBookings(response.data.bookings || response.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleTrainCreated = (newTrain) => {
    setTrains([newTrain, ...trains]);
    setShowTrainForm(false);
    setSuccessMsg("🚆 Train created successfully!");
    setTimeout(() => setSuccessMsg(""), 4000);
  };

  const handleDeleteTrain = async (trainId) => {
    if (!window.confirm("Are you sure you want to delete this train?")) return;
    try {
      await axiosInstance.delete(`/train/${trainId}`);
      setTrains(trains.filter((t) => t._id !== trainId));
      setSuccessMsg("🗑️ Train deleted successfully!");
      setTimeout(() => setSuccessMsg(""), 4000);
    } catch (err) {
      console.error(err);
    }
  };

  // Summary stats
  const totalTrains = trains.length;
  const totalBookings = allBookings.length;
  const confirmedBookings = allBookings.filter(
    (b) => b.bookingStatus === "confirmed"
  ).length;
  const cancelledBookings = allBookings.filter(
    (b) => b.bookingStatus === "cancelled"
  ).length;

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 py-8">

        {/* Success Message */}
        {successMsg && (
          <div className="bg-green-100 text-green-700 px-4 py-3 rounded-lg mb-6 font-semibold text-sm">
            {successMsg}
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard label="Total Trains" value={totalTrains} icon="🚆" color="blue" />
          <StatCard label="Total Bookings" value={totalBookings} icon="🎫" color="purple" />
          <StatCard label="Confirmed" value={confirmedBookings} icon="✅" color="green" />
          <StatCard label="Cancelled" value={cancelledBookings} icon="❌" color="red" />
        </div>

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
            🚆 Manage Trains
          </button>
          <button
            onClick={() => setActiveTab("bookings")}
            className={`px-6 py-2 rounded-lg font-semibold text-sm transition ${
              activeTab === "bookings"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-600 hover:bg-gray-50"
            }`}
          >
            🎫 All Bookings
          </button>
        </div>

        {/* Trains Tab */}
        {activeTab === "trains" && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Manage Trains</h2>
              <button
                onClick={() => setShowTrainForm(true)}
                className="bg-blue-600 text-white px-5 py-2 rounded-lg font-semibold text-sm hover:bg-blue-700 transition"
              >
                + Create Train
              </button>
            </div>

            {loading ? (
              <p className="text-gray-500">Loading trains...</p>
            ) : trains.length === 0 ? (
              <p className="text-gray-500">No trains created yet.</p>
            ) : (
              <div className="flex flex-col gap-4">
                {trains.map((train) => (
                  <div
                    key={train._id}
                    className="bg-white rounded-2xl shadow-md p-6"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex flex-col gap-2">
                        <div>
                          <h3 className="text-lg font-bold text-gray-800">
                            {train.trainName}
                          </h3>
                          <p className="text-sm text-gray-500">
                            #{train.trainNumber}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <span className="font-semibold">
                            {train.boardingPoint}
                          </span>
                          <span className="text-blue-400">→</span>
                          <span className="font-semibold">
                            {train.destinationPoint}
                          </span>
                        </div>
                        <div className="flex gap-6 text-sm text-gray-500">
                          <span>🕐 {train.departureTime} → {train.arrivalTime}</span>
                          <span>💺 {train.totalSeats} seats</span>
                          <span>₹ {train.fare}</span>
                        </div>

                        {/* Intermediate Stations */}
                        {train.intermediateStations?.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-1">
                            {train.intermediateStations.map((s, i) => (
                              <span
                                key={i}
                                className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full"
                              >
                                {s.stationName} ({s.arrivalTime})
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Delete Button */}
                      <button
                        onClick={() => handleDeleteTrain(train._id)}
                        className="text-sm text-red-500 border border-red-400 px-4 py-2 rounded-lg hover:bg-red-50 transition font-semibold"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Bookings Tab */}
        {activeTab === "bookings" && (
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              All Bookings
            </h2>
            {allBookings.length === 0 ? (
              <p className="text-gray-500">No bookings yet.</p>
            ) : (
              <div className="flex flex-col gap-4">
                {allBookings.map((booking) => (
                  <div
                    key={booking._id}
                    className="bg-white rounded-2xl shadow-md p-6"
                  >
                    <div className="flex justify-between items-start">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm flex-1">
                        <div>
                          <p className="text-xs text-gray-400">PNR</p>
                          <p className="font-bold text-blue-600">
                            {booking.pnr}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400">Passenger</p>
                          <p className="font-semibold text-gray-800">
                            {booking.user?.name}
                          </p>
                          <p className="text-xs text-gray-400">
                            {booking.user?.email}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400">Train</p>
                          <p className="font-semibold text-gray-800">
                            {booking.train?.trainName}
                          </p>
                          <p className="text-xs text-gray-400">
                            #{booking.train?.trainNumber}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400">Journey</p>
                          <p className="font-semibold text-gray-800">
                            {booking.boardingStation} → {booking.destinationStation}
                          </p>
                          <p className="text-xs text-gray-400">
                            Seat {booking.seatNumber} | Compartment{" "}
                            {booking.compartment}
                          </p>
                        </div>
                      </div>

                      <span
                        className={`text-xs font-semibold px-3 py-1 rounded-full ml-4 ${
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
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Train Form Modal */}
      {showTrainForm && (
        <TrainForm
          onSuccess={handleTrainCreated}
          onClose={() => setShowTrainForm(false)}
        />
      )}
    </div>
  );
};

// Stat Card Component
const StatCard = ({ label, value, icon, color }) => {
  const colorMap = {
    blue: "bg-blue-50 text-blue-600",
    purple: "bg-purple-50 text-purple-600",
    green: "bg-green-50 text-green-600",
    red: "bg-red-50 text-red-500",
  };

  return (
    <div className="bg-white rounded-2xl shadow-md p-5 flex flex-col gap-2">
      <div className={`text-2xl w-10 h-10 flex items-center justify-center rounded-xl ${colorMap[color]}`}>
        {icon}
      </div>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
      <p className="text-sm text-gray-500">{label}</p>
    </div>
  );
};

export default AdminDashboard;
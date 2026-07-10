import { useState } from "react";
import axiosInstance from "../utils/axiosInstance";

const TrainForm = ({ onSuccess, onClose }) => {
  const [formData, setFormData] = useState({
    trainName: "",
    trainNumber: "",
    boardingPoint: "",
    destinationPoint: "",
    departureTime: "",
    arrivalTime: "",
    totalCompartments: "",
    seatsPerCompartment: "",
    fare: "",
  });

  const [intermediateStations, setIntermediateStations] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const addStation = () => {
    setIntermediateStations([
      ...intermediateStations,
      { stationName: "", arrivalTime: "" },
    ]);
  };

  const removeStation = (index) => {
    setIntermediateStations(intermediateStations.filter((_, i) => i !== index));
  };

  const handleStationChange = (index, field, value) => {
    const updated = intermediateStations.map((station, i) =>
      i === index ? { ...station, [field]: value } : station
    );
    setIntermediateStations(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await axiosInstance.post("/train", {
        ...formData,
        totalCompartments: Number(formData.totalCompartments),
        seatsPerCompartment: Number(formData.seatsPerCompartment),
        fare: Number(formData.fare),
        intermediateStations,
      });
      // console.log(response.data); 
      onSuccess(response.data.train);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4 overflow-y-auto py-8">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-2xl">

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-800">Create New Train</h3>
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

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          {/* Train Name & Number */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-gray-700">
                Train Name
              </label>
              <input
                type="text"
                name="trainName"
                value={formData.trainName}
                onChange={handleChange}
                placeholder="e.g. Tirupathi Express"
                required
                className="border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-gray-700">
                Train Number
              </label>
              <input
                type="text"
                name="trainNumber"
                value={formData.trainNumber}
                onChange={handleChange}
                placeholder="e.g. 12345"
                required
                className="border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Boarding & Destination */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-gray-700">
                Boarding Point
              </label>
              <input
                type="text"
                name="boardingPoint"
                value={formData.boardingPoint}
                onChange={handleChange}
                placeholder="e.g. Tirupathi"
                required
                className="border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-gray-700">
                Destination Point
              </label>
              <input
                type="text"
                name="destinationPoint"
                value={formData.destinationPoint}
                onChange={handleChange}
                placeholder="e.g. Secunderabad"
                required
                className="border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Intermediate Stations */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-semibold text-gray-700">
                Intermediate Stations
              </label>
              <button
                type="button"
                onClick={addStation}
                className="text-sm bg-blue-50 text-blue-600 px-3 py-1 rounded-lg hover:bg-blue-100 transition font-semibold"
              >
                + Add Station
              </button>
            </div>

            {intermediateStations.length === 0 && (
              <p className="text-xs text-gray-400">
                No intermediate stations added yet
              </p>
            )}

            {intermediateStations.map((station, index) => (
              <div key={index} className="flex gap-3 items-center">
                <input
                  type="text"
                  placeholder="Station name"
                  value={station.stationName}
                  onChange={(e) =>
                    handleStationChange(index, "stationName", e.target.value)
                  }
                  required
                  className="border border-gray-300 rounded-lg px-4 py-2 text-sm flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="time"
                  value={station.arrivalTime}
                  onChange={(e) =>
                    handleStationChange(index, "arrivalTime", e.target.value)
                  }
                  required
                  className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={() => removeStation(index)}
                  className="text-red-400 hover:text-red-600 font-bold text-lg"
                >
                  ×
                </button>
              </div>
            ))}
          </div>

          {/* Departure & Arrival Time */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-gray-700">
                Departure Time
              </label>
              <input
                type="time"
                name="departureTime"
                value={formData.departureTime}
                onChange={handleChange}
                required
                className="border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-gray-700">
                Arrival Time
              </label>
              <input
                type="time"
                name="arrivalTime"
                value={formData.arrivalTime}
                onChange={handleChange}
                required
                className="border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Compartments, Seats & Fare */}
          <div className="grid grid-cols-3 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-gray-700">
                Compartments
              </label>
              <input
                type="number"
                name="totalCompartments"
                value={formData.totalCompartments}
                onChange={handleChange}
                placeholder="e.g. 4"
                required
                min="1"
                className="border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-gray-700">
                Seats Per Compartment
              </label>
              <input
                type="number"
                name="seatsPerCompartment"
                value={formData.seatsPerCompartment}
                onChange={handleChange}
                placeholder="e.g. 30"
                required
                min="1"
                className="border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-gray-700">
                Fare (₹)
              </label>
              <input
                type="number"
                name="fare"
                value={formData.fare}
                onChange={handleChange}
                placeholder="e.g. 450"
                required
                min="1"
                className="border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Total Seats Preview */}
          {formData.totalCompartments && formData.seatsPerCompartment && (
            <div className="bg-blue-50 rounded-lg px-4 py-3 text-sm text-blue-700 font-semibold">
              Total Seats:{" "}
              {Number(formData.totalCompartments) *
                Number(formData.seatsPerCompartment)}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Creating..." : "Create Train"}
          </button>

        </form>
      </div>
    </div>
  );
};

export default TrainForm;
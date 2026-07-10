import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import SeatGrid from "../components/SeatGrid";

const ChartVacancy = () => {
  const [searchParams] = useSearchParams();
  const [trains, setTrains] = useState([]);
  const [selectedTrain, setSelectedTrain] = useState("");
  const [boardingStation, setBoardingStation] = useState("");
  const [destinationStation, setDestinationStation] = useState("");
  const [allStations, setAllStations] = useState([]);
  const [seatMap, setSeatMap] = useState([]);
  const [filter, setFilter] = useState("all");
  const [stationFilter, setStationFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [trainInfo, setTrainInfo] = useState(null);

  useEffect(() => {
    fetchTrains();
  }, []);

  const fetchTrains = async () => {
    try {
      const response = await axiosInstance.get("/train");
      setTrains(response.data.trains || response.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleTrainChange = (e) => {
    const trainId = e.target.value;
    setSelectedTrain(trainId);
    setBoardingStation("");
    setDestinationStation("");
    setSeatMap([]);
    setSearched(false);

    // Build station list for selected train
    const train = trains.find((t) => t._id === trainId);
    if (train) {
      const stations = [
        train.boardingPoint,
        ...train.intermediateStations.map((s) => s.stationName),
        train.destinationPoint,
      ];
      setAllStations(stations);
    }
  };

  const handleSearch = async () => {
    if (!selectedTrain || !boardingStation || !destinationStation) return;
    setLoading(true);

    try {
      const response = await axiosInstance.get("/booking/chart-vacancy", {
        params: {
          trainId: selectedTrain,
          boardingStation,
          destinationStation,
        },
      });
      setSeatMap(response.data.seatMap);
      setTrainInfo(response.data.train);
      setSearched(true);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Navbar */}
      <nav className="bg-blue-600 px-10 py-4 flex justify-between items-center shadow-md">
        <div className="text-white text-2xl font-bold">🚆 TrainBook</div>
        <span className="text-white font-semibold text-sm">
          Chart Vacancy
        </span>
      </nav>

      <div className="max-w-6xl mx-auto px-4 py-8">

        {/* Search Box */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            🔍 Check Seat Availability
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">

            {/* Train Select */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-gray-700">
                Select Train
              </label>
              <select
                value={selectedTrain}
                onChange={handleTrainChange}
                className="border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Choose a train</option>
                {trains.map((train) => (
                  <option key={train._id} value={train._id}>
                    {train.trainName} #{train.trainNumber}
                  </option>
                ))}
              </select>
            </div>

            {/* Boarding Station */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-gray-700">
                Your Boarding Station
              </label>
              <select
                value={boardingStation}
                onChange={(e) => setBoardingStation(e.target.value)}
                disabled={!selectedTrain}
                className="border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-400"
              >
                <option value="">Select station</option>
                {allStations.map((station, index) => (
                  <option key={index} value={station}>
                    {station}
                  </option>
                ))}
              </select>
            </div>

            {/* Destination Station */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-gray-700">
                Your Destination Station
              </label>
              <select
                value={destinationStation}
                onChange={(e) => setDestinationStation(e.target.value)}
                disabled={!boardingStation}
                className="border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-400"
              >
                <option value="">Select station</option>
                {allStations
                  .filter(
                    (s) => allStations.indexOf(s) > allStations.indexOf(boardingStation)
                  )
                  .map((station, index) => (
                    <option key={index} value={station}>
                      {station}
                    </option>
                  ))}
              </select>
            </div>

          </div>

          <button
            onClick={handleSearch}
            disabled={!selectedTrain || !boardingStation || !destinationStation || loading}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Searching..." : "Check Vacancy"}
          </button>
        </div>

        {/* Results */}
        {searched && (
          <div>

            {/* Train Info */}
            {trainInfo && (
              <div className="bg-white rounded-2xl shadow-md p-4 mb-6 flex flex-wrap gap-6 items-center">
                <div>
                  <p className="text-xs text-gray-400">Train</p>
                  <p className="font-bold text-gray-800">{trainInfo.trainName}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Number</p>
                  <p className="font-bold text-gray-800">#{trainInfo.trainNumber}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Your Journey</p>
                  <p className="font-bold text-gray-800">
                    {boardingStation} → {destinationStation}
                  </p>
                </div>
              </div>
            )}

            {/* Legend */}
            <div className="flex flex-wrap gap-4 mb-6">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-gray-500"></div>
                <span className="text-sm text-gray-600">Full Journey Occupied</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-green-400"></div>
                <span className="text-sm text-gray-600">Part Journey Occupied</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-white border-2 border-gray-300"></div>
                <span className="text-sm text-gray-600">Vacant</span>
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3 mb-6">

              {/* Category Filter */}
              <div className="flex gap-2">
                {["all", "vacant", "partial", "full"].map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition capitalize ${
                      filter === f
                        ? "bg-blue-600 text-white"
                        : "bg-white text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {f === "all" ? "All Seats" :
                     f === "vacant" ? "⬜ Vacant" :
                     f === "partial" ? "🟩 Partial" : "⬛ Full"}
                  </button>
                ))}
              </div>

              {/* Station Filter */}
              <select
                value={stationFilter}
                onChange={(e) => setStationFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Filter by station</option>
                {allStations.map((station, index) => (
                  <option key={index} value={station}>
                    Vacant from {station}
                  </option>
                ))}
              </select>

            </div>

            {/* Seat Grid */}
            <SeatGrid
              seatMap={seatMap}
              filter={filter}
              stationFilter={stationFilter}
              allStations={allStations}
            />

          </div>
        )}

      </div>
    </div>
  );
};

export default ChartVacancy;
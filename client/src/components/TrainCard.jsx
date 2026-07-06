const TrainCard = ({ train, onBook }) => {
  const allStations = [  
    train.boardingPoint,
    ...train.intermediateStations.map((s) => s.stationName),
    train.destinationPoint,
  ];

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col gap-4 hover:shadow-lg transition">

      {/* Train Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-bold text-gray-800">
            {train.trainName}
          </h3>
          <p className="text-sm text-gray-500">#{train.trainNumber}</p>
        </div>
        <span className="bg-blue-100 text-blue-600 text-sm font-semibold px-3 py-1 rounded-full">
          ₹{train.fare}
        </span>
      </div>

      {/* Route */}
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <span className="font-semibold text-gray-800">
          {train.boardingPoint}
        </span>
        <span className="text-blue-400">→</span>
        <span className="font-semibold text-gray-800">
          {train.destinationPoint}
        </span>
      </div>

      {/* Timings */}
      <div className="flex gap-6 text-sm text-gray-500">
        <div>
          <p className="text-xs text-gray-400">Departure</p>
          <p className="font-semibold text-gray-700">{train.departureTime}</p>
        </div>
        <div>
          <p className="text-xs text-gray-400">Arrival</p>
          <p className="font-semibold text-gray-700">{train.arrivalTime}</p>
        </div>
        <div>
          <p className="text-xs text-gray-400">Total Seats</p>
          <p className="font-semibold text-gray-700">{train.totalSeats}</p>
        </div>
      </div>

      {/* Intermediate Stations */}
      {train.intermediateStations.length > 0 && (
        <div>
          <p className="text-xs text-gray-400 mb-1">Stops</p>
          <div className="flex flex-wrap gap-2">
            {allStations.map((station, index) => (
              <span
                key={index}
                className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full"
              >
                {station}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Book Button */}
      <button
        onClick={() => onBook(train)}
        className="bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition text-sm"
      >
        Book Now
      </button>

    </div>
  );
};

export default TrainCard;
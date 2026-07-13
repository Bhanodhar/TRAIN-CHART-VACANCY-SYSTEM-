const SeatModal = ({ seat, onClose }) => {
  const getStatusBadge = (status) => {
    switch (status) {
      case "full":
        return "bg-gray-200 text-gray-700";
      case "partial":
        return "bg-green-100 text-green-700";
      case "vacant":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-white-100 text-gray-600";
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "full":
        return "⬛ Full Journey Occupied";
      case "partial":
        return "🟩 Part Journey Occupied";
      case "vacant":
        return "⬜ Vacant";
      default:
        return status;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm">

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-lg font-bold text-gray-800">
              Seat {seat.seatNumber}
            </h3>
            <p className="text-sm text-gray-500">
              Compartment {seat.compartment}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
          >
            ×
          </button>
        </div>

        {/* Status Badge */}
        <div className={`px-4 py-2 rounded-lg text-sm font-semibold mb-6 ${getStatusBadge(seat.status)}`}>
          {getStatusLabel(seat.status)}
        </div>

        {/* Segments */}
        <div className="flex flex-col gap-3">
          <p className="text-sm font-semibold text-gray-700">
            Journey Segments:
          </p>

          {seat.segments.length === 0 ? (
            <div className="bg-blue-50 rounded-lg px-4 py-3 text-sm text-blue-600 font-medium">
              ✅ This seat is completely vacant
            </div>
          ) : (
            seat.segments.map((segment, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-3"
              >
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-semibold text-gray-800">
                    {segment.from}
                  </span>
                  <span className="text-gray-400">→</span>
                  <span className="font-semibold text-gray-800">
                    {segment.to}
                  </span>
                </div>
                <span className="text-xs font-semibold px-2 py-1 rounded-full bg-red-100 text-red-500">
                  Occupied
                </span>
              </div>
            ))
          )}
        </div>

        {/* Footer note */}
        <p className="text-xs text-gray-400 mt-6 text-center">
          No passenger details are shown for privacy
        </p>

        <button
          onClick={onClose}
          className="w-full mt-4 bg-gray-100 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-200 transition text-sm"
        >
          Close
        </button>

      </div>
    </div>
  );
};

export default SeatModal;
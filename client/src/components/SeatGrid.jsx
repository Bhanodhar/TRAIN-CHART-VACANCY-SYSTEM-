import { useState } from "react";
import SeatModal from "./SeatModal";

const SeatGrid = ({ seatMap, filter, stationFilter, allStations }) => {
  const [selectedSeat, setSelectedSeat] = useState(null);

  const getSeatColor = (status) => {
    switch (status) {
      case "full":
        return "bg-black-500 text-white cursor-not-allowed";
      case "partial":
        return "bg-green-400 text-white cursor-pointer hover:bg-green-500";
      case "vacant":
        return "bg-white border-2 border-gray-300 text-gray-700 cursor-pointer hover:bg-blue-50";
      default:
        return "bg-white border-2 border-gray-300";
    }
  };

  const isSeatVisible = (seat) => {
    // Category filter
    if (filter !== "all" && seat.status !== filter) {
      return false;
    }

    // Station filter
    if (stationFilter) {
      const stationIndex = allStations.indexOf(stationFilter);

      // Check if seat is vacant FROM that station onwards
      const hasBookingAfterStation = seat.segments.some((seg) => {
        const segDestIndex = allStations.indexOf(seg.to);
        return segDestIndex > stationIndex;
      });

      if (hasBookingAfterStation) return false;
    }

    return true;
  };

  return (
    <div className="flex flex-row gap-6">
      {seatMap.map((compartmentData) => (
        <div
          key={compartmentData.compartment}
          className="bg-white rounded-2xl shadow-md p-6"
        >
          {/* Compartment Header */}
          <h3 className="text-lg font-bold text-gray-800 mb-4">
            Compartment {compartmentData.compartment}
          </h3>

          {/* Seats Grid */}
          <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-3 gap-3">
            {compartmentData.seats.map((seat) => {
              const visible = isSeatVisible(seat);

              return (
                <button
                  key={seat.seatNumber}
                  onClick={() => visible && seat.status !== "full" && setSelectedSeat(seat)}
                  disabled={!visible}
                  className={`
                    w-10 h-10 rounded-lg text-xs font-bold transition
                    ${visible ? getSeatColor(seat.status) : "bg-gray-100 text-gray-300 cursor-not-allowed opacity-40"}
                  `}
                  title={`Seat ${seat.seatNumber} - ${seat.status}`}
                >
                  {seat.seatNumber}
                </button>
              );
            })}
          </div>

          {/* Compartment Summary */}
          <div className="flex gap-4 mt-4 text-xs text-gray-500">
            <span>
              ⬜ Vacant:{" "}
              {compartmentData.seats.filter((s) => s.status === "vacant").length}
            </span>
            <span>
              🟩 Partial:{" "}
              {compartmentData.seats.filter((s) => s.status === "partial").length}
            </span>
            <span>
              ⬛ Full:{" "}
              {compartmentData.seats.filter((s) => s.status === "full").length}
            </span>
          </div>
        </div>
      ))}

      {/* Seat Modal */}
      {selectedSeat && (
        <SeatModal
          seat={selectedSeat}
          onClose={() => setSelectedSeat(null)}
        />
      )}
    </div>
  );
};

export default SeatGrid;
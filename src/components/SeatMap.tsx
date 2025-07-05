import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Info } from 'lucide-react';
import { Seat, SeatMap as SeatMapType } from '../types';

interface SeatMapProps {
  seatMap: SeatMapType;
  onClose: () => void;
  onSeatSelect: (seat: Seat) => void;
}

export const SeatMap: React.FC<SeatMapProps> = ({ seatMap, onClose, onSeatSelect }) => {
  const [selectedSeat, setSelectedSeat] = useState<Seat | null>(null);
  const [hoveredSeat, setHoveredSeat] = useState<Seat | null>(null);

  const getSeatColor = (seat: Seat) => {
    if (seat.status === 'occupied') return 'bg-red-400 cursor-not-allowed';
    if (seat.status === 'selected') return 'bg-accent-primary';
    
    switch (seat.type) {
      case 'first': return 'bg-purple-500 hover:bg-purple-600 cursor-pointer';
      case 'business': return 'bg-blue-500 hover:bg-blue-600 cursor-pointer';
      case 'premium': return 'bg-green-500 hover:bg-green-600 cursor-pointer';
      default: return 'bg-gray-300 hover:bg-gray-400 cursor-pointer';
    }
  };

  const handleSeatClick = (seat: Seat) => {
    if (seat.status === 'occupied') return;
    
    if (selectedSeat) {
      selectedSeat.status = 'available';
    }
    
    seat.status = 'selected';
    setSelectedSeat(seat);
    onSeatSelect(seat);
  };

  const groupSeatsByRow = () => {
    const rows: { [key: number]: Seat[] } = {};
    seatMap.seats.forEach(seat => {
      if (!rows[seat.row]) {
        rows[seat.row] = [];
      }
      rows[seat.row].push(seat);
    });
    
    Object.keys(rows).forEach(row => {
      rows[parseInt(row)].sort((a, b) => a.letter.localeCompare(b.letter));
    });
    
    return rows;
  };

  const seatRows = groupSeatsByRow();
  const letters = seatMap.layout.includes('777') ? 
    ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J'] : 
    ['A', 'B', 'C', 'D', 'E', 'F'];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-primary-bg rounded-2xl p-6 max-w-4xl w-full max-h-[90vh] overflow-auto border border-border-primary"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-text-primary">Select Your Seat</h2>
            <p className="text-text-secondary">{seatMap.aircraft}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-primary-secondary rounded-lg transition-colors"
          >
            <X size={24} className="text-text-primary" />
          </button>
        </div>

        {/* Seat legend */}
        <div className="flex items-center gap-6 mb-6 p-4 bg-primary-secondary rounded-xl">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-300 rounded" />
            <span className="text-sm text-text-secondary">Economy</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded" />
            <span className="text-sm text-text-secondary">Premium</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-500 rounded" />
            <span className="text-sm text-text-secondary">Business</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-purple-500 rounded" />
            <span className="text-sm text-text-secondary">First</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-400 rounded" />
            <span className="text-sm text-text-secondary">Occupied</span>
          </div>
        </div>

        {/* Seat column headers */}
        <div className="flex justify-center mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8" />
            {letters.map((letter, index) => (
              <div key={letter} className="flex items-center">
                <div className="w-8 text-center text-sm font-medium text-text-secondary">
                  {letter}
                </div>
                {seatMap.layout.includes('777') && (index === 2 || index === 5) && (
                  <div className="w-4" />
                )}
                {!seatMap.layout.includes('777') && index === 2 && (
                  <div className="w-4" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Seat map */}
        <div className="space-y-2 hide-scrollbar">
          {Object.entries(seatRows).map(([rowNum, seats]) => (
            <div key={rowNum} className="flex justify-center">
              <div className="flex items-center gap-2">
                <div className="w-8 text-center text-sm font-medium text-text-secondary">
                  {rowNum}
                </div>
                {seats.map((seat, index) => (
                  <div key={seat.id} className="flex items-center">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className={`w-8 h-8 rounded ${getSeatColor(seat)} transition-all duration-200 relative`}
                      onClick={() => handleSeatClick(seat)}
                      onMouseEnter={() => setHoveredSeat(seat)}
                      onMouseLeave={() => setHoveredSeat(null)}
                      disabled={seat.status === 'occupied'}
                    >
                      {seat.status === 'selected' && (
                        <div className="absolute inset-0 bg-white/30 rounded animate-pulse" />
                      )}
                    </motion.button>
                    {seatMap.layout.includes('777') && (index === 2 || index === 5) && (
                      <div className="w-4" />
                    )}
                    {!seatMap.layout.includes('777') && index === 2 && (
                      <div className="w-4" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Seat info tooltip */}
        {hoveredSeat && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-primary-secondary rounded-xl p-4 shadow-lg max-w-xs border border-border-primary"
          >
            <div className="flex items-center gap-2 mb-2">
              <Info size={16} className="text-accent-primary" />
              <span className="font-medium text-text-primary">
                Seat {hoveredSeat.id}
              </span>
            </div>
            <p className="text-sm text-text-secondary capitalize mb-1">
              {hoveredSeat.type} Class
            </p>
            {hoveredSeat.price && hoveredSeat.price > 0 && (
              <p className="text-sm font-medium text-accent-primary">
                +${hoveredSeat.price}
              </p>
            )}
            {hoveredSeat.features && hoveredSeat.features.length > 0 && (
              <div className="mt-2">
                {hoveredSeat.features.map((feature, index) => (
                  <p key={index} className="text-xs text-text-tertiary">
                    • {feature}
                  </p>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* Confirm button */}
        {selectedSeat && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 flex justify-center"
          >
            <button className="btn-primary px-8 py-3 rounded-lg font-medium">
              Confirm Seat {selectedSeat.id}
              {selectedSeat.price && selectedSeat.price > 0 && (
                <span className="ml-2">
                  (+${selectedSeat.price})
                </span>
              )}
            </button>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
};
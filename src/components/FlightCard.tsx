import React from 'react';
import { motion } from 'framer-motion';
import { Plane, Clock, MapPin } from 'lucide-react';
import { Flight } from '../types';

interface FlightCardProps {
  flight: Flight;
  isAsymmetric?: boolean;
  onSelect?: () => void;
}

export const FlightCard: React.FC<FlightCardProps> = ({ 
  flight, 
  isAsymmetric = false, 
  onSelect 
}) => {
  const formatTime = (time: string) => {
    return time;
  };

  const formatDuration = (duration: string) => {
    return duration;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, boxShadow: "0 20px 40px rgba(0,0,0,0.1)" }}
      whileTap={{ scale: 0.98 }}
      className={`neumorphic rounded-2xl p-6 cursor-pointer transition-all duration-300 ${
        isAsymmetric ? 'transform rotate-1' : ''
      }`}
      onClick={onSelect}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-accent-primary/10 rounded-xl">
            <Plane size={20} className="text-accent-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-text-primary">{flight.airline}</h3>
            <p className="text-sm text-text-secondary">{flight.flightNumber}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-accent-primary">${flight.price}</p>
          <p className="text-sm text-text-secondary">per person</p>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <div className="text-center">
            <p className="text-lg font-semibold text-text-primary">
              {formatTime(flight.departure.time)}
            </p>
            <p className="text-sm text-text-secondary">{flight.departure.airport}</p>
            <p className="text-xs text-text-tertiary">{flight.departure.city}</p>
          </div>
          
          <div className="flex-1 flex items-center justify-center relative">
            <div className="h-px bg-neutral-primary flex-1" />
            <div className="mx-4 flex items-center gap-2">
              <Clock size={16} className="text-text-secondary" />
              <span className="text-sm text-text-secondary">
                {formatDuration(flight.duration)}
              </span>
            </div>
            <div className="h-px bg-neutral-primary flex-1" />
          </div>
          
          <div className="text-center">
            <p className="text-lg font-semibold text-text-primary">
              {formatTime(flight.arrival.time)}
            </p>
            <p className="text-sm text-text-secondary">{flight.arrival.airport}</p>
            <p className="text-xs text-text-tertiary">{flight.arrival.city}</p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MapPin size={16} className="text-text-secondary" />
          <span className="text-sm text-text-secondary">
            {flight.stops === 0 ? 'Direct' : `${flight.stops} stop${flight.stops > 1 ? 's' : ''}`}
          </span>
        </div>
        <div className="text-sm text-text-secondary">
          {flight.aircraft}
        </div>
      </div>
    </motion.div>
  );
};
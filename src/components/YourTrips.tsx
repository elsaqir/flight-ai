import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Users, MapPin } from 'lucide-react';
import { Trip } from '../types';

interface YourTripsProps {
  trips: Trip[];
}

export const YourTrips: React.FC<YourTripsProps> = ({ trips }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'text-green-400';
      case 'completed': return 'text-blue-400';
      case 'cancelled': return 'text-red-400';
      default: return 'text-white/70';
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case 'upcoming': return 'bg-green-400/20';
      case 'completed': return 'bg-blue-400/20';
      case 'cancelled': return 'bg-red-400/20';
      default: return 'bg-white/20';
    }
  };

  return (
    <div className="space-y-4">
      {trips.map((trip, index) => (
        <motion.div
          key={trip.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white/10 rounded-xl p-4 hover:bg-white/20 transition-colors"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className={`px-2 py-1 rounded-lg text-xs font-medium ${getStatusBg(trip.status)} ${getStatusColor(trip.status)}`}>
                {trip.status.charAt(0).toUpperCase() + trip.status.slice(1)}
              </div>
              <span className="text-xs text-white/70">#{trip.bookingRef}</span>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-white">${trip.totalPrice}</p>
              <p className="text-xs text-white/70">total</p>
            </div>
          </div>

          {trip.flights.map((flight, flightIndex) => (
            <div key={flight.id} className="mb-3 last:mb-0">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <MapPin size={14} className="text-white/70" />
                  <span className="text-sm text-white">
                    {flight.departure.city} → {flight.arrival.city}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={14} className="text-white/70" />
                  <span className="text-sm text-white/70">{flight.departure.date}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <p className="text-sm font-medium text-white">{flight.departure.time}</p>
                    <p className="text-xs text-white/70">{flight.departure.airport}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={12} className="text-white/70" />
                    <span className="text-xs text-white/70">{flight.duration}</span>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-white">{flight.arrival.time}</p>
                    <p className="text-xs text-white/70">{flight.arrival.airport}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Users size={14} className="text-white/70" />
                  <span className="text-sm text-white/70">{trip.passengers}</span>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      ))}
    </div>
  );
};
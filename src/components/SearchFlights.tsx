import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, Calendar, Users } from 'lucide-react';

interface SearchFlightsProps {
  onSearch: (searchData: any) => void;
}

export const SearchFlights: React.FC<SearchFlightsProps> = ({ onSearch }) => {
  const [searchData, setSearchData] = useState({
    from: '',
    to: '',
    departure: '',
    return: '',
    passengers: 1,
    class: 'economy'
  });

  const handleSearch = () => {
    onSearch(searchData);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative">
          <MapPin size={16} className="absolute left-3 top-3 text-text-secondary" />
          <input
            type="text"
            placeholder="From"
            value={searchData.from}
            onChange={(e) => setSearchData(prev => ({ ...prev, from: e.target.value }))}
            className="w-full pl-10 pr-4 py-2 bg-white/20 rounded-xl text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/30"
          />
        </div>
        <div className="relative">
          <MapPin size={16} className="absolute left-3 top-3 text-text-secondary" />
          <input
            type="text"
            placeholder="To"
            value={searchData.to}
            onChange={(e) => setSearchData(prev => ({ ...prev, to: e.target.value }))}
            className="w-full pl-10 pr-4 py-2 bg-white/20 rounded-xl text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/30"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative">
          <Calendar size={16} className="absolute left-3 top-3 text-text-secondary" />
          <input
            type="date"
            value={searchData.departure}
            onChange={(e) => setSearchData(prev => ({ ...prev, departure: e.target.value }))}
            className="w-full pl-10 pr-4 py-2 bg-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-white/30"
          />
        </div>
        <div className="relative">
          <Calendar size={16} className="absolute left-3 top-3 text-text-secondary" />
          <input
            type="date"
            value={searchData.return}
            onChange={(e) => setSearchData(prev => ({ ...prev, return: e.target.value }))}
            className="w-full pl-10 pr-4 py-2 bg-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-white/30"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative">
          <Users size={16} className="absolute left-3 top-3 text-text-secondary" />
          <select
            value={searchData.passengers}
            onChange={(e) => setSearchData(prev => ({ ...prev, passengers: parseInt(e.target.value) }))}
            className="w-full pl-10 pr-4 py-2 bg-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-white/30"
          >
            {[1, 2, 3, 4, 5, 6].map(num => (
              <option key={num} value={num} className="text-black">
                {num} passenger{num > 1 ? 's' : ''}
              </option>
            ))}
          </select>
        </div>
        <div className="relative">
          <select
            value={searchData.class}
            onChange={(e) => setSearchData(prev => ({ ...prev, class: e.target.value }))}
            className="w-full px-4 py-2 bg-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-white/30"
          >
            <option value="economy" className="text-black">Economy</option>
            <option value="premium" className="text-black">Premium Economy</option>
            <option value="business" className="text-black">Business</option>
            <option value="first" className="text-black">First Class</option>
          </select>
        </div>
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleSearch}
        className="w-full flex items-center justify-center gap-2 py-3 bg-white/20 rounded-xl text-white font-medium hover:bg-white/30 transition-colors"
      >
        <Search size={20} />
        Search Flights
      </motion.button>
    </div>
  );
};
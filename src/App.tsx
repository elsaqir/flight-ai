import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, Search, Plane, Bot, Calendar, MapPin, Users, Clock, ArrowRight, ChevronDown } from 'lucide-react';
import { ThemeProvider } from './components/ThemeProvider';
import { Sidebar } from './components/Sidebar';
import { AIAssistant } from './components/AIAssistant';
import { SeatMap } from './components/SeatMap';
import { DatePicker } from './components/DatePicker';
import { mockFlights, mockTrips, generateSeatMap } from './data/mockData';
import { Flight, Seat } from './types';

function AppContent() {
  const [activeView, setActiveView] = useState<'home' | 'search' | 'trips'>('home');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [aiAssistantOpen, setAiAssistantOpen] = useState(false);
  const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null);
  const [searchResults, setSearchResults] = useState<Flight[]>([]);
  const [showSeatMap, setShowSeatMap] = useState(false);
  const [currentSeatMap, setCurrentSeatMap] = useState<any>(null);
  const [showDeparturePicker, setShowDeparturePicker] = useState(false);
  const [showReturnPicker, setShowReturnPicker] = useState(false);
  const [showPassengerDropdown, setShowPassengerDropdown] = useState(false);
  const [searchData, setSearchData] = useState({
    from: '',
    to: '',
    departure: '',
    return: '',
    passengers: 1,
    class: 'economy'
  });

  const handleSearch = () => {
    setSearchResults(mockFlights);
    setActiveView('search');
  };

  const handleFlightSelect = (flight: Flight) => {
    setSelectedFlight(flight);
    const seatMap = generateSeatMap(flight.aircraft);
    setCurrentSeatMap(seatMap);
    setShowSeatMap(true);
  };

  const handleSeatSelect = (seat: Seat) => {
    console.log('Selected seat:', seat);
  };

  const handleAIUpdateMainView = (flights: Flight[]) => {
    setSearchResults(flights);
    setActiveView('search');
  };

  const handleAIUpdateSearchQuery = (query: any) => {
    setSearchData(prev => ({
      ...prev,
      ...query
    }));
  };

  const handleDateSelect = (date: string, type: 'departure' | 'return') => {
    setSearchData(prev => ({
      ...prev,
      [type]: date
    }));
    if (type === 'departure') {
      setShowDeparturePicker(false);
    } else {
      setShowReturnPicker(false);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 font-inter">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 hover:bg-slate-100 rounded-xl transition-all duration-200"
            >
              <Menu size={20} className="text-slate-700" />
            </button>
            
            <div className="text-center">
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                FlightFlow
              </h1>
            </div>
            
            <button
              onClick={() => setAiAssistantOpen(true)}
              className="p-2 hover:bg-slate-100 rounded-xl transition-all duration-200 relative"
            >
              <Bot size={20} className="text-slate-700" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          {activeView === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-12"
            >
              {/* Hero Section */}
              <div className="text-center space-y-6">
                <motion.h2 
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-5xl sm:text-6xl font-bold text-slate-900 leading-tight"
                >
                  Find your next
                  <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent block">
                    adventure
                  </span>
                </motion.h2>
                <motion.p 
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed"
                >
                  Book flights with confidence. Compare prices, select seats, and manage your trips all in one place.
                </motion.p>
              </div>

              {/* Modern Search Section */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white/70 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-white/20"
              >
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
                  {/* From Field */}
                  <div className="space-y-3">
                    <label className="text-sm font-semibold text-slate-700 uppercase tracking-wide">From</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <MapPin size={18} className="text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                      </div>
                      <input
                        type="text"
                        placeholder="New York"
                        value={searchData.from}
                        onChange={(e) => setSearchData(prev => ({ ...prev, from: e.target.value }))}
                        className="w-full pl-12 pr-4 py-4 bg-white/80 border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 text-lg font-medium"
                      />
                    </div>
                  </div>
                  
                  {/* To Field */}
                  <div className="space-y-3">
                    <label className="text-sm font-semibold text-slate-700 uppercase tracking-wide">To</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <MapPin size={18} className="text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                      </div>
                      <input
                        type="text"
                        placeholder="Los Angeles"
                        value={searchData.to}
                        onChange={(e) => setSearchData(prev => ({ ...prev, to: e.target.value }))}
                        className="w-full pl-12 pr-4 py-4 bg-white/80 border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 text-lg font-medium"
                      />
                    </div>
                  </div>
                  
                  {/* Departure Date */}
                  <div className="space-y-3 relative">
                    <label className="text-sm font-semibold text-slate-700 uppercase tracking-wide">Departure</label>
                    <button
                      onClick={() => setShowDeparturePicker(!showDeparturePicker)}
                      className="w-full flex items-center justify-between pl-12 pr-4 py-4 bg-white/80 border border-slate-200 rounded-2xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 text-lg font-medium group"
                    >
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Calendar size={18} className="text-slate-400 group-focus:text-blue-500 transition-colors" />
                      </div>
                      <span className={searchData.departure ? 'text-slate-900' : 'text-slate-400'}>
                        {searchData.departure ? formatDate(searchData.departure) : 'Select date'}
                      </span>
                      <ChevronDown size={18} className="text-slate-400" />
                    </button>
                    
                    <AnimatePresence>
                      {showDeparturePicker && (
                        <DatePicker
                          onSelect={(date) => handleDateSelect(date, 'departure')}
                          onClose={() => setShowDeparturePicker(false)}
                          selectedDate={searchData.departure}
                        />
                      )}
                    </AnimatePresence>
                  </div>
                  
                  {/* Passengers */}
                  <div className="space-y-3 relative">
                    <label className="text-sm font-semibold text-slate-700 uppercase tracking-wide">Passengers</label>
                    <button
                      onClick={() => setShowPassengerDropdown(!showPassengerDropdown)}
                      className="w-full flex items-center justify-between pl-12 pr-4 py-4 bg-white/80 border border-slate-200 rounded-2xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 text-lg font-medium group"
                    >
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Users size={18} className="text-slate-400 group-focus:text-blue-500 transition-colors" />
                      </div>
                      <span>{searchData.passengers} passenger{searchData.passengers > 1 ? 's' : ''}</span>
                      <ChevronDown size={18} className="text-slate-400" />
                    </button>
                    
                    <AnimatePresence>
                      {showPassengerDropdown && (
                        <motion.div
                          initial={{ opacity: 0, y: -10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -10, scale: 0.95 }}
                          className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-slate-200 z-50 overflow-hidden"
                        >
                          {[1, 2, 3, 4, 5, 6].map(num => (
                            <button
                              key={num}
                              onClick={() => {
                                setSearchData(prev => ({ ...prev, passengers: num }));
                                setShowPassengerDropdown(false);
                              }}
                              className="w-full px-4 py-3 text-left hover:bg-slate-50 transition-colors text-slate-900 font-medium"
                            >
                              {num} passenger{num > 1 ? 's' : ''}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSearch}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-4 px-8 rounded-2xl font-semibold text-lg flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <Search size={22} />
                  Search Flights
                </motion.button>
              </motion.div>

              {/* Quick Actions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <motion.button
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  onClick={() => setActiveView('trips')}
                  className="bg-white/70 backdrop-blur-xl rounded-3xl p-8 text-left hover:shadow-xl transition-all duration-300 group border border-white/20"
                >
                  <div className="flex items-center justify-between mb-6">
                    <div className="p-4 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl">
                      <Plane size={28} className="text-white" />
                    </div>
                    <ArrowRight size={24} className="text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all duration-200" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-3">Your Trips</h3>
                  <p className="text-slate-600 text-lg">{mockTrips.length} active bookings</p>
                </motion.button>
                
                <motion.button
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                  onClick={() => setAiAssistantOpen(true)}
                  className="bg-white/70 backdrop-blur-xl rounded-3xl p-8 text-left hover:shadow-xl transition-all duration-300 group border border-white/20"
                >
                  <div className="flex items-center justify-between mb-6">
                    <div className="p-4 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl">
                      <Bot size={28} className="text-white" />
                    </div>
                    <ArrowRight size={24} className="text-slate-400 group-hover:text-purple-600 group-hover:translate-x-1 transition-all duration-200" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-3">AI Assistant</h3>
                  <p className="text-slate-600 text-lg">Get personalized recommendations</p>
                </motion.button>
              </div>
            </motion.div>
          )}

          {activeView === 'search' && (
            <motion.div
              key="search"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold text-slate-900">Search Results</h2>
                  <p className="text-slate-600 text-lg">{searchResults.length} flights found</p>
                </div>
                <button
                  onClick={() => setActiveView('home')}
                  className="px-6 py-3 bg-white/80 hover:bg-white border border-slate-200 rounded-2xl text-slate-700 font-medium transition-all duration-200"
                >
                  Back to Search
                </button>
              </div>
              
              <div className="space-y-6">
                {searchResults.map((flight, index) => (
                  <motion.div
                    key={flight.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 hover:shadow-xl transition-all duration-300 cursor-pointer border border-white/20"
                    onClick={() => handleFlightSelect(flight)}
                  >
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl">
                          <Plane size={24} className="text-white" />
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-900 text-xl">{flight.airline}</h3>
                          <p className="text-slate-600">{flight.flightNumber}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                          ${flight.price}
                        </p>
                        <p className="text-slate-600">per person</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-12">
                        <div className="text-center">
                          <p className="text-2xl font-bold text-slate-900">{flight.departure.time}</p>
                          <p className="text-slate-600 font-medium">{flight.departure.airport}</p>
                          <p className="text-slate-500 text-sm">{flight.departure.city}</p>
                        </div>
                        
                        <div className="flex items-center gap-3 text-slate-500">
                          <Clock size={18} />
                          <span className="font-medium">{flight.duration}</span>
                        </div>
                        
                        <div className="text-center">
                          <p className="text-2xl font-bold text-slate-900">{flight.arrival.time}</p>
                          <p className="text-slate-600 font-medium">{flight.arrival.airport}</p>
                          <p className="text-slate-500 text-sm">{flight.arrival.city}</p>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <p className="text-slate-600 font-medium">
                          {flight.stops === 0 ? 'Direct' : `${flight.stops} stop${flight.stops > 1 ? 's' : ''}`}
                        </p>
                        <p className="text-slate-500 text-sm">{flight.aircraft}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {activeView === 'trips' && (
            <motion.div
              key="trips"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold text-slate-900">Your Trips</h2>
                  <p className="text-slate-600 text-lg">{mockTrips.length} bookings</p>
                </div>
                <button
                  onClick={() => setActiveView('home')}
                  className="px-6 py-3 bg-white/80 hover:bg-white border border-slate-200 rounded-2xl text-slate-700 font-medium transition-all duration-200"
                >
                  Back to Home
                </button>
              </div>
              
              <div className="space-y-6">
                {mockTrips.map((trip, index) => (
                  <motion.div
                    key={trip.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 border border-white/20"
                  >
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-4">
                        <div className={`px-4 py-2 rounded-full text-sm font-semibold ${
                          trip.status === 'upcoming' ? 'bg-emerald-100 text-emerald-800' :
                          trip.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {trip.status.charAt(0).toUpperCase() + trip.status.slice(1)}
                        </div>
                        <span className="text-slate-600 font-medium">#{trip.bookingRef}</span>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-slate-900">${trip.totalPrice}</p>
                        <p className="text-slate-600">total</p>
                      </div>
                    </div>

                    {trip.flights.map((flight) => (
                      <div key={flight.id} className="border-t border-slate-200 pt-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-8">
                            <div className="text-center">
                              <p className="font-bold text-slate-900 text-lg">{flight.departure.time}</p>
                              <p className="text-slate-600 font-medium">{flight.departure.airport}</p>
                              <p className="text-slate-500 text-sm">{flight.departure.city}</p>
                            </div>
                            
                            <div className="flex items-center gap-2 text-slate-500">
                              <Clock size={16} />
                              <span className="font-medium">{flight.duration}</span>
                            </div>
                            
                            <div className="text-center">
                              <p className="font-bold text-slate-900 text-lg">{flight.arrival.time}</p>
                              <p className="text-slate-600 font-medium">{flight.arrival.airport}</p>
                              <p className="text-slate-500 text-sm">{flight.arrival.city}</p>
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <p className="text-slate-600 font-medium">{flight.airline}</p>
                            <p className="text-slate-500 text-sm">{flight.flightNumber}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* AI Assistant */}
      <AIAssistant
        isOpen={aiAssistantOpen}
        onClose={() => setAiAssistantOpen(false)}
        flights={mockFlights}
        onUpdateMainView={handleAIUpdateMainView}
        onUpdateSearchQuery={handleAIUpdateSearchQuery}
      />

      {/* Seat Map Modal */}
      <AnimatePresence>
        {showSeatMap && currentSeatMap && (
          <SeatMap
            seatMap={currentSeatMap}
            onClose={() => setShowSeatMap(false)}
            onSeatSelect={handleSeatSelect}
          />
        )}
      </AnimatePresence>

      {/* Click outside handlers */}
      {(showDeparturePicker || showReturnPicker || showPassengerDropdown) && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => {
            setShowDeparturePicker(false);
            setShowReturnPicker(false);
            setShowPassengerDropdown(false);
          }}
        />
      )}
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;
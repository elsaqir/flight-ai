import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, Search, Plane, Bot, Calendar, MapPin, Users, Clock, ArrowRight } from 'lucide-react';
import { ThemeProvider } from './components/ThemeProvider';
import { Sidebar } from './components/Sidebar';
import { AIAssistant } from './components/AIAssistant';
import { SeatMap } from './components/SeatMap';
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

  return (
    <div className="min-h-screen bg-primary-bg font-inter">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-primary-bg/80 backdrop-blur-xl border-b border-border-primary mobile-safe-area">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 hover:bg-primary-secondary rounded-lg transition-colors touch-target"
            >
              <Menu size={20} className="text-text-primary sm:size-20" />
            </button>
            
            <div className="text-center">
              <h1 className="text-lg sm:text-xl font-semibold text-text-primary">FlightFlow</h1>
            </div>
            
            <button
              onClick={() => setAiAssistantOpen(true)}
              className="p-2 hover:bg-primary-secondary rounded-lg transition-colors relative touch-target"
            >
              <Bot size={20} className="text-text-primary sm:size-20" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full"></div>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8 mobile-safe-area">
        <AnimatePresence mode="wait">
          {activeView === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6 sm:space-y-8"
            >
              {/* Hero Section */}
              <div className="text-center space-y-3 sm:space-y-4">
                <h2 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-text-primary leading-tight">
                  Find your next
                  <span className="text-accent-primary"> adventure</span>
                </h2>
                <p className="text-base sm:text-xl text-text-secondary max-w-2xl mx-auto px-4">
                  Book flights with confidence. Compare prices, select seats, and manage your trips all in one place.
                </p>
              </div>

              {/* Search Section */}
              <div className="card rounded-2xl p-4 sm:p-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-text-secondary">From</label>
                    <div className="relative">
                      <MapPin size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-tertiary" />
                      <input
                        type="text"
                        placeholder="New York"
                        value={searchData.from}
                        onChange={(e) => setSearchData(prev => ({ ...prev, from: e.target.value }))}
                        className="w-full pl-10 pr-4 py-3 rounded-lg"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-text-secondary">To</label>
                    <div className="relative">
                      <MapPin size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-tertiary" />
                      <input
                        type="text"
                        placeholder="Los Angeles"
                        value={searchData.to}
                        onChange={(e) => setSearchData(prev => ({ ...prev, to: e.target.value }))}
                        className="w-full pl-10 pr-4 py-3 rounded-lg"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-text-secondary">Departure</label>
                    <div className="relative">
                      <Calendar size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-tertiary" />
                      <input
                        type="date"
                        value={searchData.departure}
                        onChange={(e) => setSearchData(prev => ({ ...prev, departure: e.target.value }))}
                        className="w-full pl-10 pr-4 py-3 rounded-lg"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-text-secondary">Passengers</label>
                    <div className="relative">
                      <Users size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-tertiary" />
                      <select
                        value={searchData.passengers}
                        onChange={(e) => setSearchData(prev => ({ ...prev, passengers: parseInt(e.target.value) }))}
                        className="w-full pl-10 pr-4 py-3 rounded-lg"
                      >
                        {[1, 2, 3, 4, 5, 6].map(num => (
                          <option key={num} value={num}>
                            {num} passenger{num > 1 ? 's' : ''}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={handleSearch}
                  className="btn-primary w-full py-3 sm:py-4 px-6 rounded-lg font-medium flex items-center justify-center gap-2 text-base sm:text-lg"
                >
                  <Search size={20} />
                  Search Flights
                </button>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <button
                  onClick={() => setActiveView('trips')}
                  className="card rounded-2xl p-4 sm:p-6 text-left hover:shadow-lg transition-all group touch-target"
                >
                  <div className="flex items-center justify-between mb-3 sm:mb-4">
                    <div className="p-3 bg-accent-primary/10 rounded-xl">
                      <Plane size={24} className="text-accent-primary" />
                    </div>
                    <ArrowRight size={20} className="text-text-tertiary group-hover:text-accent-primary transition-colors" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-text-primary mb-1 sm:mb-2">Your Trips</h3>
                  <p className="text-sm sm:text-base text-text-secondary">{mockTrips.length} active bookings</p>
                </button>
                
                <button
                  onClick={() => setAiAssistantOpen(true)}
                  className="card rounded-2xl p-4 sm:p-6 text-left hover:shadow-lg transition-all group touch-target"
                >
                  <div className="flex items-center justify-between mb-3 sm:mb-4">
                    <div className="p-3 bg-purple-500/10 rounded-xl">
                      <Bot size={24} className="text-purple-500" />
                    </div>
                    <ArrowRight size={20} className="text-text-tertiary group-hover:text-purple-500 transition-colors" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-text-primary mb-1 sm:mb-2">AI Assistant</h3>
                  <p className="text-sm sm:text-base text-text-secondary">Get personalized recommendations</p>
                </button>
              </div>
            </motion.div>
          )}

          {activeView === 'search' && (
            <motion.div
              key="search"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4 sm:space-y-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-text-primary">Search Results</h2>
                  <p className="text-sm sm:text-base text-text-secondary">{searchResults.length} flights found</p>
                </div>
                <button
                  onClick={() => setActiveView('home')}
                  className="btn-secondary px-4 py-2 rounded-lg w-full sm:w-auto"
                >
                  Back to Search
                </button>
              </div>
              
              <div className="space-y-4">
                {searchResults.map((flight, index) => (
                  <motion.div
                    key={flight.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="card rounded-2xl p-4 sm:p-6 hover:shadow-lg transition-all cursor-pointer"
                    onClick={() => handleFlightSelect(flight)}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3 sm:gap-0">
                      <div className="flex items-center gap-3 flex-1">
                        <div className="p-2 bg-accent-primary/10 rounded-lg">
                          <Plane size={20} className="text-accent-primary" />
                        </div>
                        <div>
                          <h3 className="text-sm sm:text-base font-semibold text-text-primary">{flight.airline}</h3>
                          <p className="text-sm text-text-secondary">{flight.flightNumber}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xl sm:text-2xl font-bold text-accent-primary">${flight.price}</p>
                        <p className="text-sm text-text-secondary">per person</p>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-0">
                      <div className="flex items-center gap-4 sm:gap-8 flex-1">
                        <div className="text-center">
                          <p className="text-base sm:text-lg font-semibold text-text-primary">{flight.departure.time}</p>
                          <p className="text-sm text-text-secondary">{flight.departure.airport}</p>
                          <p className="text-xs text-text-tertiary">{flight.departure.city}</p>
                        </div>
                        
                        <div className="flex items-center gap-2 text-text-secondary flex-shrink-0">
                          <Clock size={16} />
                          <span className="text-sm">{flight.duration}</span>
                        </div>
                        
                        <div className="text-center">
                          <p className="text-base sm:text-lg font-semibold text-text-primary">{flight.arrival.time}</p>
                          <p className="text-sm text-text-secondary">{flight.arrival.airport}</p>
                          <p className="text-xs text-text-tertiary">{flight.arrival.city}</p>
                        </div>
                      </div>
                      
                      <div className="text-left sm:text-right">
                        <p className="text-sm text-text-secondary">
                          {flight.stops === 0 ? 'Direct' : `${flight.stops} stop${flight.stops > 1 ? 's' : ''}`}
                        </p>
                        <p className="text-xs text-text-tertiary">{flight.aircraft}</p>
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
              className="space-y-4 sm:space-y-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-text-primary">Your Trips</h2>
                  <p className="text-sm sm:text-base text-text-secondary">{mockTrips.length} bookings</p>
                </div>
                <button
                  onClick={() => setActiveView('home')}
                  className="btn-secondary px-4 py-2 rounded-lg w-full sm:w-auto"
                >
                  Back to Home
                </button>
              </div>
              
              <div className="space-y-4">
                {mockTrips.map((trip, index) => (
                  <motion.div
                    key={trip.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="card rounded-2xl p-4 sm:p-6"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3 sm:gap-0">
                      <div className="flex items-center gap-3 flex-1">
                        <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                          trip.status === 'upcoming' ? 'bg-green-100 text-green-800' :
                          trip.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {trip.status.charAt(0).toUpperCase() + trip.status.slice(1)}
                        </div>
                        <span className="text-sm text-text-secondary">#{trip.bookingRef}</span>
                      </div>
                      <div className="text-right">
                        <p className="text-lg sm:text-xl font-bold text-text-primary">${trip.totalPrice}</p>
                        <p className="text-sm text-text-secondary">total</p>
                      </div>
                    </div>

                    {trip.flights.map((flight) => (
                      <div key={flight.id} className="border-t border-border-primary pt-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-0">
                          <div className="flex items-center gap-4 sm:gap-6 flex-1">
                            <div className="text-center">
                              <p className="text-sm sm:text-base font-semibold text-text-primary">{flight.departure.time}</p>
                              <p className="text-sm text-text-secondary">{flight.departure.airport}</p>
                              <p className="text-xs text-text-tertiary">{flight.departure.city}</p>
                            </div>
                            
                            <div className="flex items-center gap-2 text-text-secondary flex-shrink-0">
                              <Clock size={16} />
                              <span className="text-sm">{flight.duration}</span>
                            </div>
                            
                            <div className="text-center">
                              <p className="text-sm sm:text-base font-semibold text-text-primary">{flight.arrival.time}</p>
                              <p className="text-sm text-text-secondary">{flight.arrival.airport}</p>
                              <p className="text-xs text-text-tertiary">{flight.arrival.city}</p>
                            </div>
                          </div>
                          
                          <div className="text-left sm:text-right">
                            <p className="text-sm text-text-secondary">{flight.airline}</p>
                            <p className="text-xs text-text-tertiary">{flight.flightNumber}</p>
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
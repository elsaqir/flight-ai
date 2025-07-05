import { Flight, Trip, Seat, SeatMap } from '../types';

export const mockFlights: Flight[] = [
  {
    id: '1',
    airline: 'American Airlines',
    flightNumber: 'AA1234',
    departure: {
      airport: 'JFK',
      city: 'New York',
      time: '08:30',
      date: '2025-01-15'
    },
    arrival: {
      airport: 'LAX',
      city: 'Los Angeles',
      time: '12:15',
      date: '2025-01-15'
    },
    duration: '5h 45m',
    price: 299,
    stops: 0,
    aircraft: 'Boeing 737'
  },
  {
    id: '2',
    airline: 'Delta Air Lines',
    flightNumber: 'DL5678',
    departure: {
      airport: 'JFK',
      city: 'New York',
      time: '14:20',
      date: '2025-01-15'
    },
    arrival: {
      airport: 'LAX',
      city: 'Los Angeles',
      time: '18:45',
      date: '2025-01-15'
    },
    duration: '6h 25m',
    price: 249,
    stops: 1,
    aircraft: 'Airbus A320'
  },
  {
    id: '3',
    airline: 'United Airlines',
    flightNumber: 'UA9012',
    departure: {
      airport: 'JFK',
      city: 'New York',
      time: '19:15',
      date: '2025-01-15'
    },
    arrival: {
      airport: 'LAX',
      city: 'Los Angeles',
      time: '23:30',
      date: '2025-01-15'
    },
    duration: '6h 15m',
    price: 189,
    stops: 0,
    aircraft: 'Boeing 777'
  },
  {
    id: '4',
    airline: 'JetBlue Airways',
    flightNumber: 'B61234',
    departure: {
      airport: 'JFK',
      city: 'New York',
      time: '06:00',
      date: '2025-01-15'
    },
    arrival: {
      airport: 'LAX',
      city: 'Los Angeles',
      time: '09:30',
      date: '2025-01-15'
    },
    duration: '5h 30m',
    price: 329,
    stops: 0,
    aircraft: 'Airbus A321'
  },
  {
    id: '5',
    airline: 'Southwest Airlines',
    flightNumber: 'WN5678',
    departure: {
      airport: 'JFK',
      city: 'New York',
      time: '16:45',
      date: '2025-01-15'
    },
    arrival: {
      airport: 'LAX',
      city: 'Los Angeles',
      time: '22:10',
      date: '2025-01-15'
    },
    duration: '7h 25m',
    price: 199,
    stops: 1,
    aircraft: 'Boeing 737'
  },
  {
    id: '6',
    airline: 'Alaska Airlines',
    flightNumber: 'AS9876',
    departure: {
      airport: 'JFK',
      city: 'New York',
      time: '11:30',
      date: '2025-01-15'
    },
    arrival: {
      airport: 'LAX',
      city: 'Los Angeles',
      time: '15:45',
      date: '2025-01-15'
    },
    duration: '6h 15m',
    price: 279,
    stops: 0,
    aircraft: 'Boeing 737 MAX'
  }
];

export const mockTrips: Trip[] = [
  {
    id: '1',
    status: 'upcoming',
    flights: [mockFlights[0]],
    passengers: 2,
    totalPrice: 598,
    bookingRef: 'ABC123',
    date: '2025-01-15'
  },
  {
    id: '2',
    status: 'completed',
    flights: [mockFlights[1]],
    passengers: 1,
    totalPrice: 249,
    bookingRef: 'XYZ789',
    date: '2024-12-20'
  }
];

export const generateSeatMap = (aircraft: string): SeatMap => {
  const rows = aircraft.includes('777') ? 42 : 28;
  const seatsPerRow = aircraft.includes('777') ? 9 : 6;
  const layout = aircraft.includes('777') ? '3-3-3' : '3-3';
  
  const seats: Seat[] = [];
  const letters = aircraft.includes('777') ? 
    ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J'] : 
    ['A', 'B', 'C', 'D', 'E', 'F'];
  
  for (let row = 1; row <= rows; row++) {
    for (let i = 0; i < seatsPerRow; i++) {
      const letter = letters[i];
      const seatType = row <= 3 ? 'first' : 
                      row <= 8 ? 'business' : 
                      row <= 12 ? 'premium' : 'economy';
      
      // Randomly make some seats occupied
      const isOccupied = Math.random() < 0.3;
      
      seats.push({
        id: `${row}${letter}`,
        row,
        letter,
        type: seatType,
        status: isOccupied ? 'occupied' : 'available',
        price: seatType === 'first' ? 150 : 
               seatType === 'business' ? 75 : 
               seatType === 'premium' ? 35 : 0,
        features: seatType === 'first' ? ['Lie-flat', 'Priority boarding'] :
                  seatType === 'business' ? ['Extra legroom', 'Priority boarding'] :
                  seatType === 'premium' ? ['Extra legroom'] : []
      });
    }
  }
  
  return {
    aircraft,
    rows,
    seatsPerRow,
    layout,
    seats
  };
};
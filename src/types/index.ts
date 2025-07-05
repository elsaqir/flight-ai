export interface Flight {
  id: string;
  airline: string;
  flightNumber: string;
  departure: {
    airport: string;
    city: string;
    time: string;
    date: string;
  };
  arrival: {
    airport: string;
    city: string;
    time: string;
    date: string;
  };
  duration: string;
  price: number;
  stops: number;
  aircraft: string;
  seatMap?: SeatMap;
}

export interface SeatMap {
  aircraft: string;
  rows: number;
  seatsPerRow: number;
  layout: string; // e.g., "3-3-3" for wide-body
  seats: Seat[];
}

export interface Seat {
  id: string;
  row: number;
  letter: string;
  type: 'economy' | 'premium' | 'business' | 'first';
  status: 'available' | 'occupied' | 'selected';
  price?: number;
  features?: string[];
}

export interface Trip {
  id: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  flights: Flight[];
  passengers: number;
  totalPrice: number;
  bookingRef: string;
  date: string;
}

export interface AIMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: string;
  flightSuggestions?: Flight[];
}

export interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}
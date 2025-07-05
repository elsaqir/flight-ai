import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface DatePickerProps {
  onSelect: (date: string) => void;
  onClose: () => void;
  selectedDate?: string;
}

export const DatePicker: React.FC<DatePickerProps> = ({ onSelect, onClose, selectedDate }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const today = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  
  const days = [];
  
  // Add empty cells for days before the first day of the month
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(null);
  }
  
  // Add days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    days.push(day);
  }
  
  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  };
  
  const handleNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  };
  
  const handleDateClick = (day: number) => {
    const selectedDateObj = new Date(currentYear, currentMonth, day);
    const dateString = selectedDateObj.toISOString().split('T')[0];
    onSelect(dateString);
  };
  
  const isDateSelected = (day: number) => {
    if (!selectedDate) return false;
    const dateObj = new Date(currentYear, currentMonth, day);
    const dateString = dateObj.toISOString().split('T')[0];
    return dateString === selectedDate;
  };
  
  const isDatePast = (day: number) => {
    const dateObj = new Date(currentYear, currentMonth, day);
    return dateObj < today;
  };
  
  const isToday = (day: number) => {
    const dateObj = new Date(currentYear, currentMonth, day);
    return dateObj.toDateString() === today.toDateString();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      className="absolute top-full left-0 right-0 mt-2 bg-white rounded-3xl shadow-2xl border border-slate-200 z-50 overflow-hidden"
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={handlePrevMonth}
            className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
          >
            <ChevronLeft size={20} className="text-slate-600" />
          </button>
          
          <h3 className="text-lg font-bold text-slate-900">
            {monthNames[currentMonth]} {currentYear}
          </h3>
          
          <button
            onClick={handleNextMonth}
            className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
          >
            <ChevronRight size={20} className="text-slate-600" />
          </button>
        </div>
        
        {/* Days of week */}
        <div className="grid grid-cols-7 gap-1 mb-4">
          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
            <div key={day} className="text-center text-sm font-semibold text-slate-500 py-2">
              {day}
            </div>
          ))}
        </div>
        
        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-1">
          {days.map((day, index) => (
            <div key={index} className="aspect-square">
              {day && (
                <button
                  onClick={() => handleDateClick(day)}
                  disabled={isDatePast(day)}
                  className={`w-full h-full rounded-xl text-sm font-medium transition-all duration-200 ${
                    isDateSelected(day)
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                      : isToday(day)
                      ? 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                      : isDatePast(day)
                      ? 'text-slate-300 cursor-not-allowed'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {day}
                </button>
              )}
            </div>
          ))}
        </div>
        
        {/* Quick actions */}
        <div className="flex gap-2 mt-6 pt-4 border-t border-slate-200">
          <button
            onClick={() => handleDateClick(today.getDate())}
            className="px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
          >
            Today
          </button>
          <button
            onClick={() => handleDateClick(today.getDate() + 1)}
            className="px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
          >
            Tomorrow
          </button>
        </div>
      </div>
    </motion.div>
  );
};
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, X, Send, Sparkles, Plane, Clock, MapPin } from 'lucide-react';
import { AIMessage, Flight } from '../types';
import { analyzeFlightQuery, generateFlightRecommendations } from '../services/openai';

interface AIAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  flights: Flight[];
  onUpdateMainView?: (flights: Flight[]) => void;
  onUpdateSearchQuery?: (query: any) => void;
}

export const AIAssistant: React.FC<AIAssistantProps> = ({ 
  isOpen, 
  onClose, 
  flights, 
  onUpdateMainView,
  onUpdateSearchQuery 
}) => {
  const [messages, setMessages] = useState<AIMessage[]>([
    {
      id: '1',
      type: 'assistant',
      content: "Hi! I'm your AI flight assistant. I can help you find flights, compare options, and answer travel questions. Try asking me something like 'Find flights from New York to Los Angeles' or 'Show me the cheapest business class options'.",
      timestamp: new Date().toISOString(),
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: AIMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputValue;
    setInputValue('');
    setIsLoading(true);

    try {
      // Analyze the user's query with OpenAI
      const aiResponse = await analyzeFlightQuery(currentInput, flights);

      // Create AI response message
      const aiMessage: AIMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: aiResponse.message,
        timestamp: new Date().toISOString(),
      };

      // Handle different types of responses
      if (aiResponse.isSpecificQuery && aiResponse.filteredFlights && aiResponse.filteredFlights.length > 0) {
        // Show filtered results in chat
        aiMessage.flightSuggestions = aiResponse.filteredFlights;
      } else if (!aiResponse.isSpecificQuery && aiResponse.searchQuery) {
        // Update main view for general searches
        onUpdateSearchQuery?.(aiResponse.searchQuery);
        onUpdateMainView?.(flights);
        aiMessage.content += " I've updated the search form with your preferences. You can view the results in the main area.";
      } else if (aiResponse.isSpecificQuery && (!aiResponse.filteredFlights || aiResponse.filteredFlights.length === 0)) {
        // No results found for specific query
        aiMessage.content = "I couldn't find any flights matching your specific criteria. Try adjusting your requirements or use the main search form to explore more options.";
      }

      setMessages(prev => [...prev, aiMessage]);

      // Generate additional recommendations if we have flight results
      if (aiResponse.filteredFlights && aiResponse.filteredFlights.length > 0) {
        setTimeout(async () => {
          try {
            const recommendations = await generateFlightRecommendations(aiResponse.filteredFlights!, currentInput);
            
            const recommendationMessage: AIMessage = {
              id: (Date.now() + 2).toString(),
              type: 'assistant',
              content: recommendations,
              timestamp: new Date().toISOString(),
            };
            
            setMessages(prev => [...prev, recommendationMessage]);
          } catch (error) {
            console.error('Error generating recommendations:', error);
          }
        }, 1000);
      }

    } catch (error) {
      console.error('Error processing message:', error);
      
      const errorMessage: AIMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: "I'm having trouble processing your request right now. Please try again or use the search form directly.",
        timestamp: new Date().toISOString(),
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFlightSelect = (flight: Flight) => {
    // You can add logic here to handle flight selection from AI suggestions
    console.log('Selected flight from AI:', flight);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, x: 400 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 400 }}
            className="fixed right-4 top-4 bottom-4 w-96 bg-white/90 backdrop-blur-xl border border-slate-200 rounded-3xl flex flex-col z-50 shadow-2xl"
          >
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl relative">
                    <Bot size={24} className="text-white" />
                    {isLoading && (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 border-2 border-purple-300 border-t-purple-600 rounded-2xl"
                      />
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-lg">AI Assistant</h3>
                    <p className="text-sm text-slate-600 flex items-center gap-2">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                      {isLoading ? 'Thinking...' : 'Online'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  <X size={20} className="text-slate-700" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 hide-scrollbar">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] p-4 rounded-2xl ${
                    message.type === 'user' 
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white' 
                      : 'bg-slate-100 text-slate-900 border border-slate-200'
                  }`}>
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                    
                    {message.flightSuggestions && message.flightSuggestions.length > 0 && (
                      <div className="mt-4 space-y-3">
                        {message.flightSuggestions.map((flight) => (
                          <motion.div 
                            key={flight.id} 
                            className="p-4 bg-white/80 hover:bg-white rounded-2xl cursor-pointer transition-all duration-200 border border-slate-200"
                            whileHover={{ scale: 1.02 }}
                            onClick={() => handleFlightSelect(flight)}
                          >
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-2">
                                <Plane size={16} className="text-blue-600" />
                                <span className="text-sm font-semibold text-slate-900">{flight.airline}</span>
                              </div>
                              <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                ${flight.price}
                              </span>
                            </div>
                            
                            <div className="flex items-center justify-between text-sm text-slate-600 mb-2">
                              <div className="flex items-center gap-1">
                                <MapPin size={14} />
                                <span>{flight.departure.city} → {flight.arrival.city}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock size={14} />
                                <span>{flight.duration}</span>
                              </div>
                            </div>
                            
                            <div className="flex items-center justify-between text-sm text-slate-500">
                              <span>{flight.departure.time} - {flight.arrival.time}</span>
                              <span>{flight.stops === 0 ? 'Direct' : `${flight.stops} stop${flight.stops > 1 ? 's' : ''}`}</span>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
              
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="bg-slate-100 text-slate-900 border border-slate-200 p-4 rounded-2xl">
                    <div className="flex items-center gap-2">
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                        className="w-2 h-2 bg-blue-600 rounded-full"
                      />
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                        className="w-2 h-2 bg-blue-600 rounded-full"
                      />
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                        className="w-2 h-2 bg-blue-600 rounded-full"
                      />
                    </div>
                  </div>
                </motion.div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 border-t border-slate-200">
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                  placeholder="Ask me about flights..."
                  disabled={isLoading}
                  className="flex-1 px-4 py-3 rounded-2xl text-sm disabled:opacity-50 bg-slate-100 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isLoading}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white p-3 rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  <Send size={18} />
                </button>
              </div>
              
              <div className="mt-3 flex flex-wrap gap-2">
                {[
                  "Find cheap flights to Europe",
                  "Business class to Tokyo",
                  "Direct flights only",
                  "Morning departures under $300"
                ].map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="text-xs px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-600 transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
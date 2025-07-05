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
            className="fixed right-4 top-4 bottom-4 w-96 bg-primary-bg border border-border-primary rounded-2xl flex flex-col z-50 shadow-xl"
          >
            <div className="p-6 border-b border-border-primary">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-500/10 rounded-lg relative">
                    <Bot size={20} className="text-purple-500" />
                    {isLoading && (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 border-2 border-purple-500/30 border-t-purple-500 rounded-lg"
                      />
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-text-primary">AI Assistant</h3>
                    <p className="text-sm text-text-secondary flex items-center gap-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      {isLoading ? 'Thinking...' : 'Online'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-primary-secondary rounded-lg transition-colors"
                >
                  <X size={20} className="text-text-primary" />
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
                  <div className={`max-w-[85%] p-3 rounded-2xl ${
                    message.type === 'user' 
                      ? 'bg-accent-primary text-white' 
                      : 'bg-primary-secondary text-text-primary border border-border-primary'
                  }`}>
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                    
                    {message.flightSuggestions && message.flightSuggestions.length > 0 && (
                      <div className="mt-3 space-y-3">
                        {message.flightSuggestions.map((flight) => (
                          <motion.div 
                            key={flight.id} 
                            className="p-3 bg-white/5 hover:bg-white/10 rounded-xl cursor-pointer transition-colors border border-white/10"
                            whileHover={{ scale: 1.02 }}
                            onClick={() => handleFlightSelect(flight)}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <Plane size={14} className="text-accent-primary" />
                                <span className="text-xs font-medium">{flight.airline}</span>
                              </div>
                              <span className="text-sm font-bold text-accent-primary">
                                ${flight.price}
                              </span>
                            </div>
                            
                            <div className="flex items-center justify-between text-xs opacity-80 mb-1">
                              <div className="flex items-center gap-1">
                                <MapPin size={12} />
                                <span>{flight.departure.city} → {flight.arrival.city}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock size={12} />
                                <span>{flight.duration}</span>
                              </div>
                            </div>
                            
                            <div className="flex items-center justify-between text-xs opacity-70">
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
                  <div className="bg-primary-secondary text-text-primary border border-border-primary p-3 rounded-2xl">
                    <div className="flex items-center gap-2">
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                        className="w-2 h-2 bg-accent-primary rounded-full"
                      />
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                        className="w-2 h-2 bg-accent-primary rounded-full"
                      />
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                        className="w-2 h-2 bg-accent-primary rounded-full"
                      />
                    </div>
                  </div>
                </motion.div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 border-t border-border-primary">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                  placeholder="Ask me about flights..."
                  disabled={isLoading}
                  className="flex-1 px-4 py-2 rounded-lg text-sm disabled:opacity-50"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isLoading}
                  className="btn-primary p-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send size={16} />
                </button>
              </div>
              
              <div className="mt-2 flex flex-wrap gap-2">
                {[
                  "Find cheap flights to Europe",
                  "Business class to Tokyo",
                  "Direct flights only",
                  "Morning departures under $300"
                ].map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="text-xs px-2 py-1 bg-primary-secondary hover:bg-primary-tertiary rounded-lg text-text-secondary transition-colors"
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
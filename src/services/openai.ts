import OpenAI from 'openai';
import { Flight } from '../types';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Note: In production, use a backend proxy
});

export interface FlightSearchQuery {
  from?: string;
  to?: string;
  departure?: string;
  return?: string;
  passengers?: number;
  class?: string;
  preferences?: string[];
}

export interface AIResponse {
  message: string;
  searchQuery?: FlightSearchQuery;
  filteredFlights?: Flight[];
  isSpecificQuery: boolean;
}

export const analyzeFlightQuery = async (userMessage: string, availableFlights: Flight[]): Promise<AIResponse> => {
  try {
    const systemPrompt = `You are a helpful flight booking assistant. Analyze user queries about flights and respond in a natural, conversational way.

Available flights data:
${JSON.stringify(availableFlights, null, 2)}

Your tasks:
1. Determine if the user is asking for a general flight search or specific filtering
2. Extract search parameters (from, to, date, class, preferences) if it's a general search
3. If it's a specific query (like "business class flights after 6 PM"), filter the available flights and show them in chat
4. Provide a helpful, natural response

For general searches (like "flights from Paris to Tokyo"):
- Set isSpecificQuery to false
- Extract search parameters into searchQuery object
- Provide a message saying you're updating the search form

For specific filtering requests (like "only morning flights in business class"):
- Set isSpecificQuery to true
- Filter the available flights based on criteria
- Return the filtered flights in filteredFlights array
- Provide a helpful message about the results

Always respond with valid JSON in this exact format:
{
  "message": "Your natural, helpful response here",
  "searchQuery": { "from": "city", "to": "city" } (only for general searches),
  "filteredFlights": [flight objects] (only for specific filtering),
  "isSpecificQuery": true/false
}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage }
      ],
      temperature: 0.3,
      max_tokens: 1500,
    });

    const response = completion.choices[0]?.message?.content;
    if (!response) {
      throw new Error('No response from OpenAI');
    }

    // Clean the response to extract JSON
    let cleanResponse = response.trim();
    
    // Remove markdown code blocks if present
    if (cleanResponse.startsWith('```json')) {
      cleanResponse = cleanResponse.replace(/```json\n?/, '').replace(/\n?```$/, '');
    } else if (cleanResponse.startsWith('```')) {
      cleanResponse = cleanResponse.replace(/```\n?/, '').replace(/\n?```$/, '');
    }

    try {
      const parsedResponse = JSON.parse(cleanResponse);
      
      // Validate the response structure
      if (!parsedResponse.message || typeof parsedResponse.isSpecificQuery !== 'boolean') {
        throw new Error('Invalid response structure');
      }

      return parsedResponse;
    } catch (parseError) {
      console.error('JSON parsing failed:', parseError);
      
      // Fallback: try to extract meaningful information
      const isGeneralSearch = userMessage.toLowerCase().includes('from') && userMessage.toLowerCase().includes('to');
      
      return {
        message: response, // Use the raw response as message
        isSpecificQuery: !isGeneralSearch,
        ...(isGeneralSearch && {
          searchQuery: extractSearchParams(userMessage)
        })
      };
    }
  } catch (error) {
    console.error('OpenAI API error:', error);
    
    // Intelligent fallback based on user message
    const isGeneralSearch = userMessage.toLowerCase().includes('from') && userMessage.toLowerCase().includes('to');
    
    if (isGeneralSearch) {
      return {
        message: "I'll help you search for flights. Let me update the search form with your preferences.",
        searchQuery: extractSearchParams(userMessage),
        isSpecificQuery: false
      };
    } else {
      // Try to filter flights based on keywords
      const filteredFlights = filterFlightsByKeywords(userMessage, availableFlights);
      
      return {
        message: filteredFlights.length > 0 
          ? `I found ${filteredFlights.length} flight${filteredFlights.length > 1 ? 's' : ''} matching your criteria:`
          : "I'm having trouble finding flights that match your specific criteria. Please try a different search or use the main search form.",
        filteredFlights: filteredFlights.length > 0 ? filteredFlights : undefined,
        isSpecificQuery: true
      };
    }
  }
};

// Helper function to extract search parameters from natural language
const extractSearchParams = (message: string): FlightSearchQuery => {
  const query: FlightSearchQuery = {};
  
  // Extract cities (basic pattern matching)
  const fromMatch = message.match(/from\s+([a-zA-Z\s]+?)(?:\s+to|\s+$)/i);
  const toMatch = message.match(/to\s+([a-zA-Z\s]+?)(?:\s|$)/i);
  
  if (fromMatch) query.from = fromMatch[1].trim();
  if (toMatch) query.to = toMatch[1].trim();
  
  // Extract class
  if (message.toLowerCase().includes('business')) query.class = 'business';
  else if (message.toLowerCase().includes('first')) query.class = 'first';
  else if (message.toLowerCase().includes('premium')) query.class = 'premium';
  
  return query;
};

// Helper function to filter flights by keywords
const filterFlightsByKeywords = (message: string, flights: Flight[]): Flight[] => {
  const lowerMessage = message.toLowerCase();
  
  return flights.filter(flight => {
    // Filter by class
    if (lowerMessage.includes('business') || lowerMessage.includes('first')) {
      return false; // No business/first class in mock data
    }
    
    // Filter by time
    if (lowerMessage.includes('morning')) {
      const hour = parseInt(flight.departure.time.split(':')[0]);
      return hour >= 6 && hour < 12;
    }
    
    if (lowerMessage.includes('afternoon')) {
      const hour = parseInt(flight.departure.time.split(':')[0]);
      return hour >= 12 && hour < 18;
    }
    
    if (lowerMessage.includes('evening') || lowerMessage.includes('night')) {
      const hour = parseInt(flight.departure.time.split(':')[0]);
      return hour >= 18 || hour < 6;
    }
    
    // Filter by price
    if (lowerMessage.includes('cheap') || lowerMessage.includes('under')) {
      return flight.price < 250;
    }
    
    // Filter by stops
    if (lowerMessage.includes('direct') || lowerMessage.includes('non-stop')) {
      return flight.stops === 0;
    }
    
    return true;
  });
};

export const generateFlightRecommendations = async (flights: Flight[], userPreferences?: string): Promise<string> => {
  try {
    const systemPrompt = `You are a travel expert. Given these flight options, provide personalized recommendations in a natural, conversational way.

Flight options:
${JSON.stringify(flights, null, 2)}

User preferences: ${userPreferences || 'None specified'}

Provide a brief, helpful recommendation highlighting the best options and why. Be conversational and helpful. Keep it under 150 words and don't use JSON formatting.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: "What do you recommend?" }
      ],
      temperature: 0.8,
      max_tokens: 200,
    });

    return completion.choices[0]?.message?.content || "Here are some great flight options for you!";
  } catch (error) {
    console.error('OpenAI API error:', error);
    return "Here are some great flight options for you!";
  }
};
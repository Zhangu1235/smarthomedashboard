import { useState } from "react";
import { Bot, Send, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Message {
  id: string;
  type: "user" | "bot";
  content: string;
  timestamp: Date;
}

const generateAIResponse = (input: string): string => {
  // Smart home specific responses
  if (input.includes('light') || input.includes('lighting')) {
    return "I can help you control your smart lights. Currently, 6 lights are connected to your system. Would you like me to adjust brightness, change colors, or set up lighting schedules?";
  }
  
  if (input.includes('temperature') || input.includes('thermostat') || input.includes('heating') || input.includes('cooling')) {
    return "Your current home temperature is 72°F. The smart thermostat is set to auto mode. I can adjust the temperature, create heating/cooling schedules, or show energy usage patterns.";
  }
  
  if (input.includes('security') || input.includes('camera') || input.includes('alarm')) {
    return "Your home security system is active. All 4 cameras are online, and motion detection is enabled. I can show you recent alerts, arm/disarm the system, or review camera footage.";
  }
  
  if (input.includes('music') || input.includes('play') || input.includes('song')) {
    return "I can control your music system. You have Spotify and local music available. What would you like to listen to? I can play specific songs, artists, or create playlists based on your mood.";
  }
  
  if (input.includes('bluetooth') || input.includes('device') || input.includes('connect')) {
    return "I can help manage your Bluetooth connections. Currently, 2 devices are paired: AirPods Pro and Wireless Mouse. Would you like me to connect/disconnect devices or scan for new ones?";
  }
  
  if (input.includes('energy') || input.includes('power') || input.includes('usage')) {
    return "Your current energy usage is 3.2 kW. Today's consumption is 15% lower than yesterday. I can show detailed energy reports, suggest optimizations, or set up power-saving modes.";
  }
  
  if (input.includes('weather') || input.includes('forecast') || input.includes('outside')) {
    return "Today's weather: 75°F and sunny with light winds. The forecast shows partly cloudy skies tomorrow with a high of 78°F. Would you like me to adjust your home settings based on the weather?";
  }
  
  if (input.includes('schedule') || input.includes('routine') || input.includes('automation')) {
    return "I can create smart home routines for you. Popular options include 'Good Morning' (lights on, coffee maker start), 'Leaving Home' (all lights off, security armed), or 'Movie Time' (lights dim, entertainment system on).";
  }
  
  if (input.includes('help') || input.includes('what can you do') || input.includes('commands')) {
    return "I can help with: 🏠 Device control (lights, thermostat, security) 🎵 Music & entertainment 📊 Energy monitoring 📱 Device management 🤖 Home automation 📈 Data analysis. What would you like to explore?";
  }
  
  // General responses for other queries
  const responses = [
    "That's an interesting question! I'm analyzing the data from your smart home devices to provide you with the best answer.",
    "Let me check your home's current status and provide you with relevant information about that.",
    "Based on your smart home data and preferences, here's what I found that might help you.",
    "I'm processing your request using the latest information from your connected devices.",
    "Great question! I'm cross-referencing your home's data to give you the most accurate response."
  ];
  
  return responses[Math.floor(Math.random() * responses.length)];
};

export default function ChatbotPanel() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "bot",
      content: "Hello! I'm your Smart Home AI Assistant. I can help you with device control, data analysis, home security, and more. What can I assist you with today?",
      timestamp: new Date(),
    }
  ]);
  const [inputValue, setInputValue] = useState("");

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputValue("");

    // AI-powered response system
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: "bot",
        content: generateAIResponse(inputValue.toLowerCase()),
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botResponse]);
    }, 1000);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm flex flex-col h-96 xl:h-auto">
      {/* Header */}
      <div className="p-4 border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
            <Bot className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-800">AI Data Assistant</h3>
            <p className="text-xs text-green-600 flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>Online
            </p>
          </div>
        </div>
        <Button variant="ghost" size="sm">
          <MoreHorizontal className="w-4 h-4 text-slate-400" />
        </Button>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 space-y-4 overflow-y-auto">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex space-x-3 ${message.type === "user" ? "justify-end" : ""}`}
          >
            {message.type === "bot" && (
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 text-white" />
              </div>
            )}
            <div
              className={`rounded-lg px-3 py-2 max-w-xs ${
                message.type === "bot"
                  ? "bg-slate-100 text-slate-700"
                  : "bg-blue-600 text-white"
              }`}
            >
              <p className="text-sm">{message.content}</p>
            </div>
            {message.type === "user" && (
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white text-sm font-medium">A</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-slate-200">
        <div className="flex space-x-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask about your data..."
            className="flex-1"
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
          />
          <Button onClick={handleSendMessage} className="bg-blue-600 hover:bg-blue-700">
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

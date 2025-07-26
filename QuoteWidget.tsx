import { useState, useEffect } from "react";
import { Heart, RotateCw, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";

interface QuoteData {
  text: string;
  author: string;
}

const quotes: QuoteData[] = [
  {
    text: "The future belongs to those who believe in the beauty of their dreams.",
    author: "Eleanor Roosevelt",
  },
  {
    text: "It is during our darkest moments that we must focus to see the light.",
    author: "Aristotle",
  },
  {
    text: "The only way to do great work is to love what you do.",
    author: "Steve Jobs",
  },
  {
    text: "Life is what happens to you while you're busy making other plans.",
    author: "John Lennon",
  },
  {
    text: "The way to get started is to quit talking and begin doing.",
    author: "Walt Disney",
  },
];

export default function QuoteWidget() {
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const [favoriteQuotes, setFavoriteQuotes] = useState<number[]>([]);
  const [autoRotate, setAutoRotate] = useState(true);

  const currentQuote = quotes[currentQuoteIndex];

  useEffect(() => {
    if (!autoRotate) return;

    const interval = setInterval(() => {
      setCurrentQuoteIndex((prev) => (prev + 1) % quotes.length);
    }, 10000); // Change quote every 10 seconds

    return () => clearInterval(interval);
  }, [autoRotate]);

  const nextQuote = () => {
    setCurrentQuoteIndex((prev) => (prev + 1) % quotes.length);
  };

  const toggleFavorite = () => {
    setFavoriteQuotes((prev) =>
      prev.includes(currentQuoteIndex)
        ? prev.filter((index) => index !== currentQuoteIndex)
        : [...prev, currentQuoteIndex]
    );
  };

  const isFavorite = favoriteQuotes.includes(currentQuoteIndex);

  return (
    <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-4 rounded-lg text-white">
      <div className="flex items-center justify-between mb-4">
        <div className="flex space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleFavorite}
            className={`${isFavorite ? "text-red-300" : "text-white/70"} hover:bg-white/10`}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? "fill-current" : ""}`} />
          </Button>
          <Button variant="ghost" size="sm" onClick={nextQuote} className="text-white hover:bg-white/10">
            <RotateCw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="text-center">
        <Quote className="text-white/50 w-8 h-8 mx-auto mb-4" />
        <p className="text-white text-lg leading-relaxed mb-4">"{currentQuote.text}"</p>
        <p className="text-white/80 font-medium">— {currentQuote.author}</p>
      </div>

      <div className="flex items-center justify-center space-x-2 mt-6">
        {quotes.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentQuoteIndex(index)}
            className={`w-2 h-2 rounded-full transition-colors ${
              index === currentQuoteIndex ? "bg-white" : "bg-white/30"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

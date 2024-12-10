import { useState, useEffect } from "react";

const quotes = [
  "Building wealth together",
  "Smart money moves",
  "Financial freedom awaits",
  "Track every penny"
];

export const MotivationalQuote = () => {
  const [currentQuote, setCurrentQuote] = useState(quotes[0]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuote(prev => {
        const currentIndex = quotes.indexOf(prev);
        return quotes[(currentIndex + 1) % quotes.length];
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return <p className="text-sm text-gray-500">{currentQuote}</p>;
};
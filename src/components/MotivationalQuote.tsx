import { useEffect, useState } from "react";

const quotes = [
  "Save more",
  "Spend wise",
  "Plan ahead",
  "Track daily",
  "Budget smart",
  "Think future"
];

export const MotivationalQuote = () => {
  const [quote, setQuote] = useState(quotes[0]);

  useEffect(() => {
    const interval = setInterval(() => {
      const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
      setQuote(randomQuote);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="pl-2 -mt-0.5">
      <p className="text-sm text-gray-500">
        {quote}
      </p>
    </div>
  );
};
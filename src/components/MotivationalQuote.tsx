import { useEffect, useState } from "react";

const quotes = [
  "Save for tomorrow",
  "Track your money",
  "Smart spending works",
  "Plan your wealth"
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
    <div className="pl-0.5 -mt-0.5">
      <p className="text-sm text-white/80 leading-relaxed">
        {quote}
      </p>
    </div>
  );
};
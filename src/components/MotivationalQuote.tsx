import { useEffect, useState } from "react";

const quotes = [
  "Invest in yourself",
  "Small steps, big changes",
  "Every penny counts",
  "Save today, prosper tomorrow",
  "Your future self will thank you",
  "Smart spending, better living"
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
    <div className="pl-2 mt-0.5">
      <p className="text-base text-gray-600">
        {quote}
      </p>
    </div>
  );
};
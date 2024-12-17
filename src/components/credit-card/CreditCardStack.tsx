import { useFinance } from "@/contexts/FinanceContext";
import { cn } from "@/lib/utils";
import { useState } from "react";

export const CreditCardStack = () => {
  const { paymentSources } = useFinance();
  const [activeIndex, setActiveIndex] = useState(0);
  
  // Filter only credit type payment sources
  const creditCards = paymentSources.filter(source => source.type === "credit");

  // If no credit cards, don't render anything
  if (creditCards.length === 0) {
    return null;
  }

  const formatCardNumber = (name: string) => {
    return `•••• ${name.slice(-4)}`;
  };

  return (
    <div className="relative h-48 w-full">
      {creditCards.map((card, index) => (
        <div
          key={card.id}
          className={cn(
            "absolute left-0 right-0 w-full h-40 rounded-apple p-6 cursor-pointer transition-all duration-300 ease-in-out",
            "bg-gradient-to-br from-violet-600 to-indigo-600",
            index === activeIndex ? "z-30 translate-y-0 opacity-100 scale-100" : 
            index === activeIndex + 1 ? "z-20 translate-y-4 opacity-90 scale-95" :
            index === activeIndex + 2 ? "z-10 translate-y-8 opacity-80 scale-90" :
            "opacity-0 translate-y-12 scale-85",
          )}
          onClick={() => setActiveIndex(index)}
        >
          <div className="flex flex-col h-full text-white">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-6 bg-white/20 rounded-md" />
              <div className="w-6 h-6 bg-white/20 rounded-full" />
            </div>
            <p className="text-lg font-medium tracking-widest mb-2">
              {formatCardNumber(card.name)}
            </p>
            <div className="mt-auto flex items-center justify-between">
              <p className="text-sm font-medium opacity-90">{card.name}</p>
              <div className="flex -space-x-3">
                <div className="w-6 h-6 rounded-full bg-red-500/80" />
                <div className="w-6 h-6 rounded-full bg-orange-400/80" />
              </div>
            </div>
          </div>
        </div>
      ))}
      
      {creditCards.length > 1 && (
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex gap-1">
          {creditCards.map((_, index) => (
            <button
              key={index}
              className={cn(
                "w-1.5 h-1.5 rounded-full transition-all",
                index === activeIndex ? "bg-white w-3" : "bg-white/50"
              )}
              onClick={() => setActiveIndex(index)}
            />
          ))}
        </div>
      )}
    </div>
  );
};
import { useFinance } from "@/contexts/FinanceContext";
import { cn } from "@/lib/utils";
import { useState, useRef } from "react";

export const CreditCardStack = () => {
  const { paymentSources } = useFinance();
  const [activeIndex, setActiveIndex] = useState(0);
  const [startX, setStartX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Filter only credit type payment sources
  const creditCards = paymentSources.filter(source => source.type === "credit");

  // If no credit cards, don't render anything
  if (creditCards.length === 0) {
    return null;
  }

  const formatCardNumber = (name: string) => {
    return `•••• ${name.slice(-4)}`;
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setStartX(e.touches[0].clientX);
    setIsDragging(true);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setStartX(e.clientX);
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    
    const currentX = e.touches[0].clientX;
    const diff = startX - currentX;

    if (Math.abs(diff) > 50) {
      if (diff > 0 && activeIndex < creditCards.length - 1) {
        setActiveIndex(prev => prev + 1);
        setIsDragging(false);
      } else if (diff < 0 && activeIndex > 0) {
        setActiveIndex(prev => prev - 1);
        setIsDragging(false);
      }
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    
    const currentX = e.clientX;
    const diff = startX - currentX;

    if (Math.abs(diff) > 50) {
      if (diff > 0 && activeIndex < creditCards.length - 1) {
        setActiveIndex(prev => prev + 1);
        setIsDragging(false);
      } else if (diff < 0 && activeIndex > 0) {
        setActiveIndex(prev => prev - 1);
        setIsDragging(false);
      }
    }
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  return (
    <div 
      ref={containerRef}
      className="relative h-48 w-full select-none touch-pan-y"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleDragEnd}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleDragEnd}
      onMouseLeave={handleDragEnd}
    >
      {creditCards.map((card, index) => {
        const isActive = index === activeIndex;
        const isNext = index === activeIndex + 1;
        const isNextNext = index === activeIndex + 2;
        const isPrevious = index < activeIndex;
        const isFuture = index > activeIndex + 2;

        return (
          <div
            key={card.id}
            className={cn(
              "absolute inset-0 w-full h-40 rounded-apple p-6 cursor-pointer",
              "bg-gradient-to-br from-violet-600 to-indigo-600",
              "transition-all duration-300 ease-out transform-gpu will-change-transform",
              isActive && "z-30 translate-y-0 opacity-100 scale-100",
              isNext && "z-20 translate-y-4 opacity-90 scale-95 blur-[1px]",
              isNextNext && "z-10 translate-y-8 opacity-80 scale-90 blur-[2px]",
              isPrevious && "-translate-y-4 opacity-0 scale-90 pointer-events-none",
              isFuture && "translate-y-12 opacity-0 scale-85 pointer-events-none"
            )}
            onClick={() => !isDragging && setActiveIndex(index)}
          >
            <div className="flex flex-col h-full text-white">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-6 bg-white/20 rounded-md backdrop-blur-sm" />
                <div className="w-6 h-6 bg-white/20 rounded-full backdrop-blur-sm" />
              </div>
              <p className="text-lg font-medium tracking-widest mb-2">
                {formatCardNumber(card.name)}
              </p>
              <div className="mt-auto flex items-center justify-between">
                <p className="text-sm font-medium opacity-90">{card.name}</p>
                <div className="flex -space-x-3">
                  <div className="w-6 h-6 rounded-full bg-red-500/80 backdrop-blur-sm" />
                  <div className="w-6 h-6 rounded-full bg-orange-400/80 backdrop-blur-sm" />
                </div>
              </div>
            </div>
          </div>
        );
      })}
      
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
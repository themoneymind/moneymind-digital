import { useState, useRef, TouchEvent } from "react";
import { PaymentSource } from "@/types/finance";
import { CreditCardItem } from "./CreditCardItem";

interface CreditCardListProps {
  creditCards: PaymentSource[];
  onActiveIndexChange: (index: number) => void;
  activeIndex: number;
}

export const CreditCardList = ({ 
  creditCards, 
  onActiveIndexChange, 
  activeIndex 
}: CreditCardListProps) => {
  const touchStartX = useRef<number | null>(null);

  const handleTouchStart = (e: TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: TouchEvent) => {
    if (touchStartX.current === null) return;

    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;
    const threshold = 50; // minimum distance for swipe

    if (Math.abs(diff) > threshold) {
      if (diff > 0 && activeIndex < creditCards.length - 1) {
        // Swipe left
        onActiveIndexChange(activeIndex + 1);
      } else if (diff < 0 && activeIndex > 0) {
        // Swipe right
        onActiveIndexChange(activeIndex - 1);
      }
    }

    touchStartX.current = null;
  };

  return (
    <div>
      <div 
        className="px-6 touch-pan-x"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <CreditCardItem card={creditCards[activeIndex]} />
      </div>
      
      {creditCards.length > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          {creditCards.map((_, index) => (
            <button
              key={index}
              onClick={() => onActiveIndexChange(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === activeIndex 
                  ? "bg-primary w-4" 
                  : "bg-gray-300 hover:bg-gray-400"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};
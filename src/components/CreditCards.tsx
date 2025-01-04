import { useFinance } from "@/contexts/FinanceContext";
import { CreditCardItem } from "./credit-card/CreditCardItem";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useRef, TouchEvent } from "react";
import { RecentTransactions } from "./RecentTransactions";

export const CreditCards = () => {
  const { paymentSources } = useFinance();
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);
  
  const creditCards = paymentSources.filter(source => source.type === "Credit Card");

  const handleAddCard = () => {
    navigate("/app/payment-source?type=credit");
  };

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
        setActiveIndex(prev => prev + 1);
      } else if (diff < 0 && activeIndex > 0) {
        // Swipe right
        setActiveIndex(prev => prev - 1);
      }
    }

    touchStartX.current = null;
  };

  return (
    <div className="space-y-6 overflow-x-hidden mb-8">
      <div className="flex items-center justify-between px-6">
        <h2 className="text-base font-semibold">Credit Cards</h2>
        <button
          onClick={handleAddCard}
          className="flex items-center text-black hover:text-black/80 transition-colors"
        >
          <Plus className="h-4 w-4 mr-1.5" strokeWidth={1.5} />
          <span className="text-xs">Add Card</span>
        </button>
      </div>
      
      <div className="relative w-full">
        {creditCards.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground w-full">
            No credit cards added yet
          </div>
        ) : (
          <>
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
                    onClick={() => setActiveIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index === activeIndex 
                        ? "bg-primary w-4" 
                        : "bg-gray-300 hover:bg-gray-400"
                    }`}
                  />
                ))}
              </div>
            )}

            {creditCards[activeIndex] && (
              <div className="mt-6">
                <RecentTransactions 
                  filterByType="Credit Card"
                  showViewAll={false}
                  sourceId={creditCards[activeIndex].id}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
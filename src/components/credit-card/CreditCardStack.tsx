import { useFinance } from "@/contexts/FinanceContext";
import { useRef } from "react";
import { CreditCard } from "./CreditCard";
import { CardPagination } from "./CardPagination";
import { useCardSwipe } from "@/hooks/useCardSwipe";

export const CreditCardStack = () => {
  const { paymentSources } = useFinance();
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Filter only credit type payment sources
  const creditCards = paymentSources.filter(source => source.type === "credit");

  // If no credit cards, don't render anything
  if (creditCards.length === 0) {
    return null;
  }

  const { activeIndex, setActiveIndex, isDragging, handlers } = useCardSwipe(creditCards.length);

  return (
    <div className="mt-4">
      <div 
        ref={containerRef}
        className="relative h-52 w-full select-none touch-pan-y mx-auto max-w-md"
        {...handlers}
      >
        {creditCards.map((card, index) => (
          <CreditCard
            key={card.id}
            card={card}
            index={index}
            activeIndex={activeIndex}
            isDragging={isDragging}
            onClick={() => setActiveIndex(index)}
          />
        ))}
        
        <CardPagination 
          cards={creditCards}
          activeIndex={activeIndex}
          onSelect={setActiveIndex}
        />
      </div>
    </div>
  );
};
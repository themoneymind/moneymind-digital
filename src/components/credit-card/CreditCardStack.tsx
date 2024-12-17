import { useFinance } from "@/contexts/FinanceContext";
import useEmblaCarousel from 'embla-carousel-react';
import { useCallback, useEffect, useState } from "react";
import { CreditCardDisplay } from "./CreditCardDisplay";
import { CreditCardNavigation } from "./CreditCardNavigation";
import { useCreditCardCalculations } from "@/hooks/useCreditCardCalculations";

export const CreditCardStack = () => {
  const { paymentSources, transactions, currentMonth } = useFinance();
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false });
  const [prevBtnEnabled, setPrevBtnEnabled] = useState(false);
  const [nextBtnEnabled, setNextBtnEnabled] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Debug: Log all payment sources
  console.log("DEBUG - All payment sources:", paymentSources);
  
  // Filter credit card sources
  const creditCards = paymentSources.filter(source => {
    console.log("DEBUG - Checking source:", source);
    const isCredit = source.type && source.type.toLowerCase() === "credit";
    console.log("DEBUG - Is credit card?", isCredit);
    return isCredit;
  });
  
  console.log("DEBUG - Filtered credit cards:", creditCards);
  
  const { calculateCreditCardUsage } = useCreditCardCalculations(creditCards, transactions, currentMonth);
  const creditCardUsage = calculateCreditCardUsage();
  console.log("DEBUG - Credit card usage:", creditCardUsage);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setPrevBtnEnabled(emblaApi.canScrollPrev());
    setNextBtnEnabled(emblaApi.canScrollNext());
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
  }, [emblaApi, onSelect]);
  
  console.log("DEBUG - Should render stack?", {
    hasPaymentSources: paymentSources.length > 0,
    hasCreditCards: creditCards.length > 0,
    creditCardsCount: creditCards.length
  });
  
  if (creditCards.length === 0) {
    console.log("DEBUG - No credit cards found, not rendering stack");
    return null;
  }

  return (
    <div className="p-6 mx-4 space-y-4">
      <h2 className="text-lg font-semibold text-gray-900">Credit Cards</h2>
      <div className="relative">
        {/* Stack effect container */}
        <div className="relative h-[250px]">
          {/* Background cards for stack effect */}
          <div 
            className="absolute top-4 left-1/2 -translate-x-1/2 w-[95%] opacity-20"
            style={{ transform: 'translateX(-48%) rotate(-4deg)' }}
          >
            <div className="w-full h-48 bg-gray-300 rounded-apple" />
          </div>
          <div 
            className="absolute top-2 left-1/2 -translate-x-1/2 w-[97%] opacity-40"
            style={{ transform: 'translateX(-49%) rotate(-2deg)' }}
          >
            <div className="w-full h-48 bg-gray-400 rounded-apple" />
          </div>
          
          {/* Main carousel */}
          <div className="overflow-hidden relative" ref={emblaRef}>
            <div className="flex">
              {creditCardUsage.map((card, index) => (
                <div
                  key={card.id}
                  className="flex-[0_0_100%] min-w-0 relative pl-2 pr-4"
                >
                  <CreditCardDisplay 
                    card={card}
                    isSelected={selectedIndex === index}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <CreditCardNavigation
          prevBtnEnabled={prevBtnEnabled}
          nextBtnEnabled={nextBtnEnabled}
          onPrevClick={scrollPrev}
          onNextClick={scrollNext}
          totalCards={creditCards.length}
          selectedIndex={selectedIndex}
        />
      </div>
    </div>
  );
};
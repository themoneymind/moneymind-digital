import { useFinance } from "@/contexts/FinanceContext";
import useEmblaCarousel from 'embla-carousel-react';
import { useCallback, useEffect, useState } from "react";
import { CreditCardDisplay } from "./CreditCardDisplay";
import { CreditCardNavigation } from "./CreditCardNavigation";
import { useCreditCardCalculations } from "@/hooks/useCreditCardCalculations";

export const CreditCardStack = () => {
  const { paymentSources, transactions, currentMonth } = useFinance();
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    loop: false,
    align: 'center',
    containScroll: 'trimSnaps'
  });
  const [prevBtnEnabled, setPrevBtnEnabled] = useState(false);
  const [nextBtnEnabled, setNextBtnEnabled] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Filter credit card sources
  const creditCards = paymentSources.filter(source => 
    source.type?.toLowerCase() === "credit"
  );
  
  const { calculateCreditCardUsage } = useCreditCardCalculations(creditCards, transactions, currentMonth);
  const creditCardUsage = calculateCreditCardUsage();

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

  // Always render the component structure, even if there are no credit cards
  return (
    <div className="p-6 mx-4 space-y-4">
      <h2 className="text-lg font-semibold text-gray-900">Credit Cards</h2>
      <div className="relative">
        {/* Stack effect container */}
        <div className="relative h-[250px]">
          {/* Background cards for stack effect */}
          {creditCards.length > 0 && (
            <>
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
            </>
          )}
          
          {/* Main carousel */}
          <div className="overflow-hidden relative" ref={emblaRef}>
            <div className="flex">
              {creditCardUsage.length > 0 ? (
                creditCardUsage.map((card, index) => (
                  <div
                    key={card.id}
                    className="flex-[0_0_100%] min-w-0 relative pl-2 pr-4"
                  >
                    <CreditCardDisplay 
                      card={card}
                      isSelected={selectedIndex === index}
                    />
                  </div>
                ))
              ) : (
                <div className="flex-[0_0_100%] min-w-0 relative pl-2 pr-4">
                  <div className="p-6 bg-white rounded-apple text-center text-gray-500">
                    No credit cards added yet
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {creditCardUsage.length > 0 && (
          <CreditCardNavigation
            prevBtnEnabled={prevBtnEnabled}
            nextBtnEnabled={nextBtnEnabled}
            onPrevClick={scrollPrev}
            onNextClick={scrollNext}
            totalCards={creditCards.length}
            selectedIndex={selectedIndex}
          />
        )}
      </div>
    </div>
  );
};
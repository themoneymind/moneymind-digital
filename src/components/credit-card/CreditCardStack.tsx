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

  // Filter credit card sources
  const creditCards = paymentSources.filter(source => source.type === "credit");
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

  if (creditCards.length === 0) {
    return null;
  }

  return (
    <div className="p-6 mx-4 space-y-4">
      <h2 className="text-lg font-semibold text-gray-900">Credit Cards</h2>
      <div className="relative">
        <div className="overflow-hidden" ref={emblaRef}>
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
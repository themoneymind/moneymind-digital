import useEmblaCarousel from 'embla-carousel-react';
import { useState, useCallback, useEffect } from "react";
import { CreditCardDisplay } from "../credit-card/CreditCardDisplay";
import { CreditCardUsage } from "@/hooks/useCreditCardCalculations";

interface CreditCardCarouselProps {
  creditCardUsage: CreditCardUsage[];
}

export const CreditCardCarousel = ({ creditCardUsage }: CreditCardCarouselProps) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    loop: false,
    align: 'center',
    containScroll: 'trimSnaps'
  });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
  }, [emblaApi, onSelect]);

  return (
    <>
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {creditCardUsage.map((card, index) => (
            <div
              key={card.id}
              className="flex-[0_0_100%] min-w-0"
            >
              <div className="mx-4">
                <CreditCardDisplay 
                  card={card}
                  isSelected={selectedIndex === index}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {creditCardUsage.length > 0 && (
        <div className="flex justify-center gap-1.5 mt-4">
          {creditCardUsage.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-colors ${
                selectedIndex === index ? 'bg-white' : 'bg-white/30'
              }`}
            />
          ))}
        </div>
      )}
    </>
  );
};
import useEmblaCarousel from 'embla-carousel-react';
import { useState, useCallback, useEffect } from "react";
import { CreditCardDisplay } from "../credit-card/CreditCardDisplay";
import { CreditCardUsage } from "@/hooks/useCreditCardCalculations";
import { Button } from "../ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";

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
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi, onSelect]);

  if (creditCardUsage.length === 0) return null;

  return (
    <div className="relative">
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

      {creditCardUsage.length > 1 && (
        <>
          <Button
            variant="ghost"
            size="icon"
            className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white shadow-md ${
              !canScrollPrev && 'opacity-50 cursor-not-allowed'
            }`}
            onClick={scrollPrev}
            disabled={!canScrollPrev}
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white shadow-md ${
              !canScrollNext && 'opacity-50 cursor-not-allowed'
            }`}
            onClick={scrollNext}
            disabled={!canScrollNext}
          >
            <ArrowRight className="w-4 h-4" />
          </Button>
        </>
      )}

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
    </div>
  );
};
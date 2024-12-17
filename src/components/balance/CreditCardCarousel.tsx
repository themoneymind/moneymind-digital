import { useState, useCallback, useEffect } from "react";
import { CreditCardDisplay } from "../credit-card/CreditCardDisplay";
import { CreditCardUsage } from "@/hooks/useCreditCardCalculations";
import { CreditCardNavigation } from "../credit-card/CreditCardNavigation";
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem,
} from "@/components/ui/carousel";

interface CreditCardCarouselProps {
  creditCardUsage: CreditCardUsage[];
}

export const CreditCardCarousel = ({ creditCardUsage }: CreditCardCarouselProps) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const scrollPrev = useCallback(() => {
    if (selectedIndex > 0) {
      setSelectedIndex(selectedIndex - 1);
      setCanScrollNext(true);
      setCanScrollPrev(selectedIndex - 1 > 0);
    }
  }, [selectedIndex]);

  const scrollNext = useCallback(() => {
    if (selectedIndex < creditCardUsage.length - 1) {
      setSelectedIndex(selectedIndex + 1);
      setCanScrollPrev(true);
      setCanScrollNext(selectedIndex + 1 < creditCardUsage.length - 1);
    }
  }, [selectedIndex, creditCardUsage.length]);

  useEffect(() => {
    setCanScrollNext(creditCardUsage.length > 1);
  }, [creditCardUsage.length]);

  if (creditCardUsage.length === 0) return null;

  return (
    <div className="relative px-4">
      <Carousel
        opts={{
          align: "center",
          loop: false,
        }}
        className="w-full"
      >
        <CarouselContent>
          {creditCardUsage.map((card, index) => (
            <CarouselItem key={card.id}>
              <div className="p-1">
                <CreditCardDisplay 
                  card={card}
                  isSelected={selectedIndex === index}
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      <CreditCardNavigation
        prevBtnEnabled={canScrollPrev}
        nextBtnEnabled={canScrollNext}
        onPrevClick={scrollPrev}
        onNextClick={scrollNext}
        totalCards={creditCardUsage.length}
        selectedIndex={selectedIndex}
      />
    </div>
  );
};
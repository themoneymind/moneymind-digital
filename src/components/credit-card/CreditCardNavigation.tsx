import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";

type CreditCardNavigationProps = {
  prevBtnEnabled: boolean;
  nextBtnEnabled: boolean;
  onPrevClick: () => void;
  onNextClick: () => void;
  totalCards: number;
  selectedIndex: number;
};

export const CreditCardNavigation = ({
  prevBtnEnabled,
  nextBtnEnabled,
  onPrevClick,
  onNextClick,
  totalCards,
  selectedIndex,
}: CreditCardNavigationProps) => {
  if (totalCards <= 1) return null;

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white shadow-md ${
          !prevBtnEnabled && 'opacity-50 cursor-not-allowed'
        }`}
        onClick={onPrevClick}
        disabled={!prevBtnEnabled}
      >
        <ArrowLeft className="w-4 h-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white shadow-md ${
          !nextBtnEnabled && 'opacity-50 cursor-not-allowed'
        }`}
        onClick={onNextClick}
        disabled={!nextBtnEnabled}
      >
        <ArrowRight className="w-4 h-4" />
      </Button>
      <div className="flex justify-center gap-1 mt-4">
        {Array.from({ length: totalCards }).map((_, index) => (
          <div
            key={index}
            className={`w-2 h-2 rounded-full transition-colors ${
              selectedIndex === index ? 'bg-primary' : 'bg-gray-300'
            }`}
          />
        ))}
      </div>
    </>
  );
};
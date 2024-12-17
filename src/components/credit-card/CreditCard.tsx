import { cn } from "@/lib/utils";

type CreditCardProps = {
  card: {
    id: string;
    name: string;
  };
  index: number;
  activeIndex: number;
  isDragging: boolean;
  onClick: () => void;
};

export const CreditCard = ({ card, index, activeIndex, isDragging, onClick }: CreditCardProps) => {
  const formatCardNumber = (name: string) => {
    return `•••• ${name.slice(-4)}`;
  };

  const isActive = index === activeIndex;
  const isNext = index === activeIndex + 1;
  const isNextNext = index === activeIndex + 2;
  const isPrevious = index < activeIndex;
  const isFuture = index > activeIndex + 2;

  return (
    <div
      className={cn(
        "absolute inset-x-4 h-44 rounded-apple p-6 cursor-pointer",
        "bg-gradient-to-br from-violet-600 to-indigo-600",
        "transition-all duration-300 ease-out transform-gpu will-change-transform",
        isActive && "z-30 translate-y-0 opacity-100 scale-100",
        isNext && "z-20 translate-y-4 opacity-90 scale-[0.97] blur-[1px]",
        isNextNext && "z-10 translate-y-8 opacity-80 scale-[0.94] blur-[2px]",
        isPrevious && "-translate-y-4 opacity-0 scale-90 pointer-events-none",
        isFuture && "translate-y-12 opacity-0 scale-85 pointer-events-none",
        !isActive && "pointer-events-none"
      )}
      onClick={() => !isDragging && onClick()}
    >
      <div className="flex flex-col h-full text-white">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-6 bg-white/20 rounded-md backdrop-blur-sm" />
          <div className="w-6 h-6 bg-white/20 rounded-full backdrop-blur-sm" />
        </div>
        <p className="text-lg font-medium tracking-widest mb-2">
          {formatCardNumber(card.name)}
        </p>
        <div className="mt-auto flex items-center justify-between">
          <p className="text-sm font-medium opacity-90">{card.name}</p>
          <div className="flex -space-x-3">
            <div className="w-6 h-6 rounded-full bg-red-500/80 backdrop-blur-sm" />
            <div className="w-6 h-6 rounded-full bg-orange-400/80 backdrop-blur-sm" />
          </div>
        </div>
      </div>
    </div>
  );
};
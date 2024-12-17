import { cn } from "@/lib/utils";

type CardPaginationProps = {
  cards: Array<any>;
  activeIndex: number;
  onSelect: (index: number) => void;
};

export const CardPagination = ({ cards, activeIndex, onSelect }: CardPaginationProps) => {
  if (cards.length <= 1) return null;

  return (
    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex gap-1">
      {cards.map((_, index) => (
        <button
          key={index}
          className={cn(
            "w-1.5 h-1.5 rounded-full transition-all",
            index === activeIndex ? "bg-white w-3" : "bg-white/50"
          )}
          onClick={() => onSelect(index)}
        />
      ))}
    </div>
  );
};
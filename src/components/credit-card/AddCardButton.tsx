import { Plus } from "lucide-react";

interface AddCardButtonProps {
  onClick: () => void;
}

export const AddCardButton = ({ onClick }: AddCardButtonProps) => {
  return (
    <button
      onClick={onClick}
      className="flex items-center text-black hover:text-black/80 transition-colors"
    >
      <Plus className="h-4 w-4 mr-1.5" strokeWidth={1.5} />
      <span className="text-xs">Add Card</span>
    </button>
  );
};
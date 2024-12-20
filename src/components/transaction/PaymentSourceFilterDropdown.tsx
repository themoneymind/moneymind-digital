import { IndianRupee } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useFinance } from "@/contexts/FinanceContext";

type PaymentSourceFilterDropdownProps = {
  onSourceSelect: (sourceId: string | null) => void;
};

export const PaymentSourceFilterDropdown = ({
  onSourceSelect,
}: PaymentSourceFilterDropdownProps) => {
  const { paymentSources } = useFinance();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          className="rounded-full w-9 h-9 p-0 bg-gray-100 text-gray-600 hover:bg-gray-200"
          variant="outline"
        >
          <IndianRupee className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 bg-white border border-gray-200 shadow-lg rounded-[12px] p-1">
        <DropdownMenuItem 
          className="px-3 py-2 text-sm font-medium text-gray-900"
          onClick={() => onSourceSelect(null)}
        >
          All Sources
        </DropdownMenuItem>
        {paymentSources.map((source) => (
          <DropdownMenuItem
            key={source.id}
            className="flex items-center justify-between px-3 py-2 text-sm cursor-pointer hover:bg-gray-50 rounded-[8px]"
            onClick={() => onSourceSelect(source.id)}
          >
            <span>{source.name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
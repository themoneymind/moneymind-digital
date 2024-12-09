import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { formatCurrency } from "@/utils/formatCurrency";
import { PaymentSourceCardProps } from "@/types";
import { MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";

export const PaymentSourceCard = ({ source }: PaymentSourceCardProps) => {
  const handleEditClick = () => {
    // TODO: Implement edit functionality
    console.log("Edit clicked for source:", source.id);
  };

  return (
    <div className="border-b border-gray-100 last:border-0">
      <div className="flex items-center justify-between p-3">
        <div className="flex items-center gap-2.5 flex-1 min-w-0">
          <div className="w-8 h-8 bg-green-50 rounded-[8px] flex items-center justify-center flex-shrink-0">
            <span className="text-green-500 text-xs font-medium">
              {source.name[0].toUpperCase()}
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-col">
              <p className="text-sm font-medium text-gray-900 truncate">
                {source.name}
              </p>
              {source.upiId && (
                <p className="text-xs text-gray-500 truncate">{source.upiId}</p>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-sm font-medium text-gray-900 whitespace-nowrap">
            {formatCurrency(source.amount)}
          </span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 hover:bg-gray-100 rounded-[8px]"
              >
                <MoreVertical className="w-3.5 h-3.5 text-gray-500" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleEditClick}>
                Edit Payment Source
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};
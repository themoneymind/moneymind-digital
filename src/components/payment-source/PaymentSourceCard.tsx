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
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
            <span className="text-blue-600 font-medium">
              {source.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {source.name}
            </p>
            {source.upiId && (
              <p className="text-xs text-gray-500 truncate">{source.upiId}</p>
            )}
          </div>
        </div>
        <div className="flex items-center">
          <span className="text-sm font-medium text-gray-900 whitespace-nowrap mr-6">
            {formatCurrency(source.amount)}
          </span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 hover:bg-gray-100 rounded-[8px] mr-2"
              >
                <MoreVertical className="w-4 h-4 text-gray-500" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
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
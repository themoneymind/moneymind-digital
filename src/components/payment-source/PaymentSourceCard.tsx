import { useState } from "react";
import { MoreVertical, ChevronDown, ChevronUp, Pencil, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PaymentSourceDialog } from "./PaymentSourceDialog";
import { useFinance } from "@/contexts/FinanceContext";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

type PaymentSourceCardProps = {
  source: {
    id: string;
    name: string;
    type: string;
    amount: number;
    linked?: boolean;
    upi_apps?: string[];
  };
};

export const PaymentSourceCard = ({ source }: PaymentSourceCardProps) => {
  const { deletePaymentSource } = useFinance();
  const { toast } = useToast();
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showUpiList, setShowUpiList] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleDelete = () => {
    deletePaymentSource(source.id);
    toast({
      title: "Success",
      description: "Payment source deleted successfully",
    });
  };

  return (
    <div className="group bg-white rounded-[16px] border border-gray-100 hover:border-gray-200 transition-colors">
      <div className="flex items-center justify-between py-3 px-4">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="w-8 h-8 bg-green-50 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-green-500 text-xs font-medium">
              {source.name[0].toUpperCase()}
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-col justify-center">
              <p className="text-sm font-medium text-gray-900 truncate">
                {source.name}
              </p>
              <span className="text-xs text-gray-500">{source.type}</span>
              {source.linked && source.upi_apps && source.upi_apps.length > 0 && (
                <button
                  onClick={() => setShowUpiList(!showUpiList)}
                  className="flex items-center gap-0.5 text-xs text-blue-600 w-fit mt-0.5"
                >
                  {source.upi_apps.length} UPI linked
                  {showUpiList ? (
                    <ChevronUp className="w-3 h-3" />
                  ) : (
                    <ChevronDown className="w-3 h-3" />
                  )}
                </button>
              )}
            </div>
            {showUpiList && source.upi_apps && (
              <div className="space-y-1 mt-2">
                {source.upi_apps.map((app) => (
                  <div
                    key={app}
                    className="text-xs text-gray-600 pl-2"
                  >
                    {app}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-4 ml-auto">
          <span className="text-sm font-medium text-gray-900 whitespace-nowrap">
            {formatCurrency(source.amount)}
          </span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity rounded-full hover:bg-gray-100"
              >
                <MoreVertical className="w-4 h-4 text-gray-500" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-36 bg-white border border-gray-200 shadow-lg rounded-[12px] p-1">
              <DropdownMenuItem 
                onClick={() => setShowEditDialog(true)}
                className="gap-2 text-sm cursor-pointer hover:bg-gray-50 rounded-[8px]"
              >
                <Pencil className="w-4 h-4" />
                Edit
              </DropdownMenuItem>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem
                    className="gap-2 text-sm text-red-500 focus:text-red-500 cursor-pointer hover:bg-gray-50 rounded-[8px]"
                    onSelect={(e) => e.preventDefault()}
                  >
                    <Trash className="w-4 h-4" />
                    Delete
                  </DropdownMenuItem>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete the
                      payment source and remove it from all transactions.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDelete}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <PaymentSourceDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        source={source}
      />
    </div>
  );
};

import { useState } from "react";
import { MoreVertical, Plus, Minus, ChevronDown, ChevronUp } from "lucide-react";
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
import { AmountDialog } from "./AmountDialog";
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
    upiApps?: string[];
  };
};

export const PaymentSourceCard = ({ source }: PaymentSourceCardProps) => {
  const { deletePaymentSource } = useFinance();
  const { toast } = useToast();
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showAmountDialog, setShowAmountDialog] = useState(false);
  const [showUpiList, setShowUpiList] = useState(false);
  const [amountOperation, setAmountOperation] = useState<"add" | "subtract">("add");

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

  const handleAmountEdit = (operation: "add" | "subtract") => {
    setAmountOperation(operation);
    setShowAmountDialog(true);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-green-50 rounded-[12px] flex items-center justify-center">
            <span className="text-green-500 text-lg">
              {source.name[0].toUpperCase()}
            </span>
          </div>
          <div>
            <p className="text-base font-medium text-gray-900">{source.name}</p>
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <span>{source.type}</span>
              {source.linked && source.upiApps && source.upiApps.length > 0 && (
                <button
                  onClick={() => setShowUpiList(!showUpiList)}
                  className="flex items-center gap-1 text-blue-600"
                >
                  {source.upiApps.length} UPI linked
                  {showUpiList ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-base font-medium text-gray-900">
            {formatCurrency(source.amount)}
          </span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-gray-100 rounded-[12px]"
              >
                <MoreVertical className="w-5 h-5 text-gray-500" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleAmountEdit("add")}>
                <Plus className="w-4 h-4 mr-2" />
                Add Amount
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleAmountEdit("subtract")}>
                <Minus className="w-4 h-4 mr-2" />
                Subtract Amount
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setShowEditDialog(true)}>
                Edit Details
              </DropdownMenuItem>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem
                    className="text-red-600"
                    onSelect={(e) => e.preventDefault()}
                  >
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

      {showUpiList && source.upiApps && (
        <div className="ml-16 space-y-2">
          {source.upiApps.map((app) => (
            <div
              key={app}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-[12px]"
            >
              <span className="text-sm text-gray-600">{app}</span>
            </div>
          ))}
        </div>
      )}

      <PaymentSourceDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        source={source}
      />
      
      <AmountDialog
        open={showAmountDialog}
        onOpenChange={setShowAmountDialog}
        source={source}
        operation={amountOperation}
      />
    </div>
  );
};
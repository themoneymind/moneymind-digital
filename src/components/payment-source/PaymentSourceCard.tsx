import { useState } from "react";
import { MoreVertical, ChevronDown, ChevronUp, Plus, Minus } from "lucide-react";
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
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { NewTransaction } from "../NewTransaction";

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
  const [showTransactionDialog, setShowTransactionDialog] = useState(false);
  const [transactionType, setTransactionType] = useState<"expense" | "income">("expense");

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

  const handleTransactionClick = (type: "expense" | "income") => {
    setTransactionType(type);
    setShowTransactionDialog(true);
  };

  return (
    <div className="border-b border-gray-100 last:border-0">
      <div className="flex items-center justify-between py-4 px-4">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="w-7 h-7 bg-green-50 rounded-[8px] flex items-center justify-center flex-shrink-0">
            <span className="text-green-500 text-[10px] font-medium">
              {source.name[0].toUpperCase()}
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-col justify-center">
              <p className="text-xs font-medium text-gray-900 truncate leading-5">
                {source.name}
              </p>
              <span className="text-[10px] text-gray-500 leading-4">{source.type}</span>
              {source.linked && source.upi_apps && source.upi_apps.length > 0 && (
                <button
                  onClick={() => setShowUpiList(!showUpiList)}
                  className="flex items-center gap-0.5 text-[10px] text-blue-600 w-fit leading-4 mt-0.5"
                >
                  {source.upi_apps.length} UPI linked
                  {showUpiList ? (
                    <ChevronUp className="w-2.5 h-2.5" />
                  ) : (
                    <ChevronDown className="w-2.5 h-2.5" />
                  )}
                </button>
              )}
            </div>
            {showUpiList && source.upi_apps && (
              <div className="space-y-0.5 mt-1">
                {source.upi_apps.map((app) => (
                  <div
                    key={app}
                    className="text-[10px] text-gray-600 pl-2 leading-4"
                  >
                    {app}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-4 ml-auto">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 hover:bg-gray-100 rounded-full"
              onClick={() => handleTransactionClick("expense")}
            >
              <Minus className="w-3.5 h-3.5 text-red-500" />
            </Button>
            <span className="text-xs font-medium text-gray-900 whitespace-nowrap">
              {formatCurrency(source.amount)}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 hover:bg-gray-100 rounded-full"
              onClick={() => handleTransactionClick("income")}
            >
              <Plus className="w-3.5 h-3.5 text-green-500" />
            </Button>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 hover:bg-transparent p-0"
              >
                <MoreVertical className="w-3.5 h-3.5 text-gray-500" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-32">
              <DropdownMenuItem 
                onClick={() => setShowEditDialog(true)}
                className="gap-2 text-xs"
              >
                Edit
              </DropdownMenuItem>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem
                    className="gap-2 text-xs text-red-500 focus:text-red-500"
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

      <PaymentSourceDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        source={source}
      />

      <Dialog open={showTransactionDialog} onOpenChange={setShowTransactionDialog}>
        <DialogContent className="sm:max-w-[425px] p-0">
          <NewTransaction 
            initialType={transactionType}
            initialSource={source.id}
            onSuccess={() => setShowTransactionDialog(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};
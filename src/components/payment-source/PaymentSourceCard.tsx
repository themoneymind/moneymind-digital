import { useState } from "react";
import { MoreVertical } from "lucide-react";
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
    upiApps?: string[];
  };
};

export const PaymentSourceCard = ({ source }: PaymentSourceCardProps) => {
  const { deletePaymentSource } = useFinance();
  const { toast } = useToast();
  const [showEditDialog, setShowEditDialog] = useState(false);

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
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-green-50 rounded-[12px] flex items-center justify-center">
          <span className="text-green-500 text-lg">
            {source.name[0].toUpperCase()}
          </span>
        </div>
        <div>
          <p className="text-base font-medium text-gray-900">{source.name}</p>
          <p className="text-sm text-gray-500">
            {source.type}
            {source.linked && source.upiApps && source.upiApps.length > 0 && (
              <span className="ml-1">({source.upiApps.join(", ")})</span>
            )}
          </p>
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
            <DropdownMenuItem onClick={() => setShowEditDialog(true)}>
              Edit
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
      <PaymentSourceDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        source={source}
      />
    </div>
  );
};
import { useState, useCallback } from "react";
import { PaymentSourceDialog } from "./PaymentSourceDialog";
import { useFinance } from "@/contexts/FinanceContext";
import { useToast } from "@/hooks/use-toast";
import { PaymentSourceInfo } from "./PaymentSourceInfo";
import { PaymentSourceActions } from "./PaymentSourceActions";
import { Wallet } from "lucide-react";

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
  const [isAlertOpen, setIsAlertOpen] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleDelete = useCallback(() => {
    deletePaymentSource(source.id);
    setIsAlertOpen(false);
    toast({
      title: "Success",
      description: "Payment source deleted successfully",
    });
  }, [deletePaymentSource, source.id, toast]);

  const handleEditClick = useCallback(() => {
    setShowEditDialog(true);
  }, []);

  const handleEditDialogClose = useCallback((open: boolean) => {
    if (!open) {
      setShowEditDialog(false);
    }
  }, []);

  return (
    <>
      <div className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors rounded-xl border border-gray-100">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="w-10 h-10 bg-primary-gradient-from/10 rounded-full flex items-center justify-center flex-shrink-0">
            <Wallet className="w-5 h-5 text-primary" />
          </div>
          
          <PaymentSourceInfo
            name={source.name}
            type={source.type}
            upiApps={source.upi_apps}
            linked={source.linked}
            showUpiList={showUpiList}
            setShowUpiList={setShowUpiList}
          />
        </div>
        
        <div className="flex items-center gap-4 ml-auto">
          <span className="text-sm font-medium text-gray-900 whitespace-nowrap">
            {formatCurrency(source.amount)}
          </span>
          <PaymentSourceActions
            onEdit={handleEditClick}
            onDelete={handleDelete}
            isAlertOpen={isAlertOpen}
            setIsAlertOpen={setIsAlertOpen}
          />
        </div>
      </div>

      <PaymentSourceDialog
        open={showEditDialog}
        onOpenChange={handleEditDialogClose}
        source={source}
      />
    </>
  );
};
import { useState, useCallback } from "react";
import { Separator } from "@/components/ui/separator";
import { PaymentSourceDialog } from "./PaymentSourceDialog";
import { useFinance } from "@/contexts/FinanceContext";
import { useToast } from "@/hooks/use-toast";
import { PaymentSourceInfo } from "./PaymentSourceInfo";
import { PaymentSourceActions } from "./PaymentSourceActions";

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
      <div className="flex items-center justify-between py-2.5 px-4 hover:bg-gray-50 transition-colors group">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="w-8 h-8 bg-green-50 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-green-500 text-xs font-medium">
              {source.name[0].toUpperCase()}
            </span>
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
      <Separator className="last:hidden" />

      <PaymentSourceDialog
        open={showEditDialog}
        onOpenChange={handleEditDialogClose}
        source={source}
      />
    </>
  );
};
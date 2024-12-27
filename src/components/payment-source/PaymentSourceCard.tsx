import { useState, useCallback } from "react";
import { PaymentSourceDialog } from "./PaymentSourceDialog";
import { useFinance } from "@/contexts/FinanceContext";
import { useToast } from "@/hooks/use-toast";
import { PaymentSourceInfo } from "./PaymentSourceInfo";
import { ArrowDownLeft } from "lucide-react";
import { PaymentSource } from "@/types/finance";

type PaymentSourceCardProps = {
  source: PaymentSource;
};

export const PaymentSourceCard = ({ source }: PaymentSourceCardProps) => {
  const { deletePaymentSource, refreshData } = useFinance();
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

  const handleDelete = useCallback(async () => {
    try {
      await deletePaymentSource(source.id);
      setIsAlertOpen(false);
      setShowEditDialog(false);
      await refreshData();
      toast({
        title: "Success",
        description: "Payment source deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting payment source:", error);
      toast({
        title: "Error",
        description: "Failed to delete payment source",
        variant: "destructive",
      });
    }
  }, [deletePaymentSource, source.id, toast, refreshData]);

  const handleEditDialogClose = useCallback((open: boolean) => {
    if (!open) {
      setShowEditDialog(false);
      refreshData();
    }
  }, [refreshData]);

  const handleUpiToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowUpiList(!showUpiList);
  };

  return (
    <div 
      className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors rounded-xl border border-gray-100 cursor-pointer space-y-0"
      onClick={() => setShowEditDialog(true)}
    >
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className="w-8 h-8 bg-green-50 rounded-full flex items-center justify-center flex-shrink-0">
          <ArrowDownLeft className="w-4 h-4 text-green-500" />
        </div>
        
        <PaymentSourceInfo
          name={source.name}
          type={source.type}
          upiApps={source.upi_apps}
          linked={source.linked}
          showUpiList={showUpiList}
          setShowUpiList={setShowUpiList}
          onUpiToggle={handleUpiToggle}
        />
      </div>
      
      <div className="flex items-center gap-4 ml-4">
        <span className="text-sm font-medium text-gray-900 whitespace-nowrap">
          {formatCurrency(source.amount)}
        </span>
      </div>

      <PaymentSourceDialog
        open={showEditDialog}
        onOpenChange={handleEditDialogClose}
        source={source}
        onDelete={handleDelete}
      />
    </div>
  );
};

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFinance } from "@/contexts/FinanceContext";
import { useNavigate } from "react-router-dom";
import { PaymentSourceCard } from "./payment-source/PaymentSourceCard";

export const PaymentSources = () => {
  const { paymentSources } = useFinance();
  const navigate = useNavigate();

  const handleAddSource = () => {
    navigate("/app/payment-source");
  };

  return (
    <div className="p-6 mx-4 bg-white rounded-apple shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Payment Sources</h2>
        <Button
          size="icon"
          variant="ghost"
          className="hover:bg-gray-100 rounded-[12px] w-8 h-8"
          onClick={handleAddSource}
        >
          <Plus className="w-5 h-5 text-gray-700" />
        </Button>
      </div>
      <div className="space-y-4">
        {paymentSources.map((source) => (
          <PaymentSourceCard key={source.id} source={source} />
        ))}
      </div>
    </div>
  );
};
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFinance } from "@/contexts/FinanceContext";
import { Link } from "react-router-dom";
import { PaymentSourceCard } from "./payment-source/PaymentSourceCard";

export const PaymentSources = () => {
  const { paymentSources } = useFinance();

  return (
    <div className="p-6 mx-4 bg-white rounded-[20px]">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold">Payment Sources</h2>
        <Link to="/payment-source">
          <Button
            size="icon"
            variant="ghost"
            className="hover:bg-gray-100 rounded-[12px]"
          >
            <Plus className="w-5 h-5 text-gray-700" />
          </Button>
        </Link>
      </div>
      <div className="space-y-6">
        {paymentSources.map((source) => (
          <PaymentSourceCard key={source.id} source={source} />
        ))}
      </div>
    </div>
  );
};
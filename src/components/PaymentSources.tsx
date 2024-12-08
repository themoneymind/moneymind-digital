import { Plus, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFinance } from "@/contexts/FinanceContext";
import { Link } from "react-router-dom";

export const PaymentSources = () => {
  const { paymentSources } = useFinance();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="p-6 mx-4 bg-white rounded-[20px]">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold">Payment Sources</h2>
        <Link to="/payment-source">
          <Button size="icon" variant="ghost" className="hover:bg-gray-100 rounded-[12px]">
            <Plus className="w-5 h-5 text-gray-700" />
          </Button>
        </Link>
      </div>
      <div className="space-y-6">
        {paymentSources.map((source) => (
          <div key={source.id} className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-50 rounded-[12px] flex items-center justify-center">
                <span className="text-green-500 text-lg">{source.name[0].toUpperCase()}</span>
              </div>
              <div>
                <p className="text-base font-medium text-gray-900">{source.name}</p>
                <p className="text-sm text-gray-500">
                  {source.type}
                  {source.linked && source.upiApps && source.upiApps.length > 0 && (
                    <span className="ml-1">
                      ({source.upiApps.join(", ")})
                    </span>
                  )}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-base font-medium text-gray-900">{formatCurrency(source.amount)}</span>
              <Button variant="ghost" size="icon" className="hover:bg-gray-100 rounded-[12px]">
                <MoreVertical className="w-5 h-5 text-gray-500" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
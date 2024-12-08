import { Plus, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFinance } from "@/contexts/FinanceContext";

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
    <div className="p-4 mx-4 bg-white rounded-xl">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Payment Sources</h2>
        <Button size="icon" variant="ghost">
          <Plus className="w-5 h-5" />
        </Button>
      </div>
      <div className="space-y-4">
        {paymentSources.map((source) => (
          <div key={source.id} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-500">{source.name[0]}</span>
              </div>
              <div>
                <p className="font-medium">{source.name}</p>
                <p className="text-sm text-gray-500">
                  {source.type}
                  {source.linked && (
                    <span className="text-blue-500 ml-2">
                      {source.linked} UPI linked
                    </span>
                  )}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium">{formatCurrency(source.amount)}</span>
              <Button variant="ghost" size="icon">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
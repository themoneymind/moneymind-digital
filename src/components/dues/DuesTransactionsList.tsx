import { useFinance } from "@/contexts/FinanceContext";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Clock, AlertCircle, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export const DuesTransactionsList = () => {
  const { transactions } = useFinance();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const duesTransactions = transactions.filter(t => 
    t.reference_type === 'due'
  ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Completed
          </Badge>
        );
      case 'partially_paid':
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">
            <Clock className="w-3 h-3 mr-1" />
            Partially Paid
          </Badge>
        );
      default:
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-200">
            <AlertCircle className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        );
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="mt-4 space-y-4">
      <h3 className="text-lg font-semibold flex items-center gap-2">
        <span>Due Transactions</span>
        <Badge variant="outline" className="ml-2">
          {duesTransactions.length}
        </Badge>
      </h3>
      <div className="space-y-3">
        {duesTransactions.map((transaction) => (
          <div 
            key={transaction.id}
            className="bg-white rounded-[12px] border border-gray-200 overflow-hidden transition-all duration-200"
          >
            <div 
              className="p-4 cursor-pointer hover:bg-gray-50"
              onClick={() => toggleExpand(transaction.id)}
            >
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <p className="font-medium">{transaction.description}</p>
                  <p className="text-sm text-gray-500">
                    {format(new Date(transaction.date), 'PPP')}
                  </p>
                </div>
                <div className="text-right">
                  <p className={`font-semibold ${
                    transaction.type === 'expense' ? 'text-red-600' : 'text-green-600'
                  }`}>
                    {transaction.type === 'expense' ? '-' : '+'}
                    {formatCurrency(Number(transaction.amount))}
                  </p>
                  {getStatusBadge(transaction.status || 'pending')}
                </div>
              </div>
              <div className="flex items-center justify-center mt-2">
                {expandedId === transaction.id ? (
                  <ChevronUp className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                )}
              </div>
            </div>
            <div className={cn(
              "grid transition-all duration-200",
              expandedId === transaction.id ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
            )}>
              <div className="overflow-hidden">
                <div className="p-4 pt-0 bg-gray-50 space-y-3">
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="w-full"
                    >
                      Mark as Complete
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="w-full"
                    >
                      Add Partial Payment
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
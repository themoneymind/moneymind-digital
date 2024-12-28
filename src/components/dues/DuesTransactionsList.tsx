import { useFinance } from "@/contexts/FinanceContext";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, Percent, Edit2 } from "lucide-react";
import { toast } from "sonner";

export const DuesTransactionsList = () => {
  const { transactions } = useFinance();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleComplete = (id: string) => {
    toast.success("Marked as complete");
    // Add implementation later
  };

  const handlePartial = (id: string) => {
    toast.success("Marked as partially paid");
    // Add implementation later
  };

  const handleReject = (id: string) => {
    toast.success("Marked as rejected");
    // Add implementation later
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
            <Percent className="w-3 h-3 mr-1" />
            Partially Paid
          </Badge>
        );
      case 'rejected':
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-200">
            <XCircle className="w-3 h-3 mr-1" />
            Rejected
          </Badge>
        );
      default:
        return (
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">
            Pending
          </Badge>
        );
    }
  };

  return (
    <div className="mt-4 space-y-4">
      <h3 className="text-base font-semibold">Due Transactions</h3>
      <div className="space-y-3">
        {transactions.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No transactions yet
          </div>
        ) : (
          transactions.map((transaction) => (
            <div 
              key={transaction.id}
              className="bg-white p-4 rounded-[12px] border border-gray-200 space-y-3"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">{transaction.description || 'No description'}</p>
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
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="flex-1 gap-2"
                  onClick={() => handleComplete(transaction.id)}
                >
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  Complete
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="flex-1 gap-2"
                  onClick={() => handlePartial(transaction.id)}
                >
                  <Percent className="w-4 h-4 text-yellow-600" />
                  Partial
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="flex-1 gap-2"
                  onClick={() => handleReject(transaction.id)}
                >
                  <XCircle className="w-4 h-4 text-red-600" />
                  Reject
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2"
                >
                  <Edit2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
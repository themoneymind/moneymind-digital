import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, Percent, Calendar, AlertCircle, Clock } from "lucide-react";
import { format } from "date-fns";
import { DueTransaction } from "@/types/dues";
import { cn } from "@/lib/utils";

type DuesStatusBadgeProps = {
  transaction: DueTransaction;
  className?: string;
};

export const DuesStatusBadge = ({ transaction, className }: DuesStatusBadgeProps) => {
  const status = transaction.status || 'pending';

  const badgeClasses = {
    completed: "bg-green-50 text-green-700 hover:bg-green-100",
    partially_paid: "bg-yellow-50 text-yellow-700 hover:bg-yellow-100",
    payment_scheduled: "bg-blue-50 text-blue-700 hover:bg-blue-100",
    rejected: "bg-red-50 text-red-700 hover:bg-red-100",
    overdue: "bg-orange-50 text-orange-700 hover:bg-orange-100",
    pending: "bg-gray-50 text-gray-700 hover:bg-gray-100"
  };

  const getStatusContent = () => {
    switch (status) {
      case 'completed':
        return (
          <>
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Completed
          </>
        );
      case 'partially_paid':
        return (
          <>
            <Percent className="w-3 h-3 mr-1" />
            Partially Paid ({formatCurrency(transaction.remaining_balance || 0)} remaining)
          </>
        );
      case 'payment_scheduled':
        return (
          <>
            <Calendar className="w-3 h-3 mr-1" />
            Scheduled ({format(new Date(transaction.repayment_date || ''), 'PP')})
          </>
        );
      case 'rejected':
        return (
          <>
            <XCircle className="w-3 h-3 mr-1" />
            Rejected
          </>
        );
      case 'overdue':
        return (
          <>
            <AlertCircle className="w-3 h-3 mr-1" />
            Overdue
          </>
        );
      default:
        return (
          <>
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </>
        );
    }
  };

  return (
    <Badge 
      variant="secondary"
      className={cn(
        "font-medium border",
        badgeClasses[status as keyof typeof badgeClasses],
        className
      )}
    >
      {getStatusContent()}
    </Badge>
  );
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
};
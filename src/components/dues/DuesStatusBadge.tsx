import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, Percent, Calendar, AlertCircle, Clock } from "lucide-react";
import { format } from "date-fns";
import { DueTransaction } from "@/types/dues";

type DuesStatusBadgeProps = {
  transaction: DueTransaction;
};

export const DuesStatusBadge = ({ transaction }: DuesStatusBadgeProps) => {
  const status = transaction.status || 'pending';

  const getBadgeClasses = (baseColors: string) => 
    `inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${baseColors}`;

  switch (status) {
    case 'completed':
      return (
        <span className={getBadgeClasses("bg-green-50 text-green-700")}>
          <CheckCircle2 className="w-4 h-4 mr-1.5" />
          Completed
        </span>
      );
    case 'partially_paid':
      return (
        <span className={getBadgeClasses("bg-yellow-50 text-yellow-700")}>
          <Percent className="w-4 h-4 mr-1.5" />
          Partially Paid ({formatCurrency(transaction.remaining_balance || 0)} remaining)
        </span>
      );
    case 'payment_scheduled':
      return (
        <span className={getBadgeClasses("bg-blue-50 text-blue-700")}>
          <Calendar className="w-4 h-4 mr-1.5" />
          Scheduled ({format(new Date(transaction.repayment_date || ''), 'PP')})
        </span>
      );
    case 'rejected':
      return (
        <span className={getBadgeClasses("bg-red-50 text-red-700")}>
          <XCircle className="w-4 h-4 mr-1.5" />
          Rejected
        </span>
      );
    case 'overdue':
      return (
        <span className={getBadgeClasses("bg-orange-50 text-orange-700")}>
          <AlertCircle className="w-4 h-4 mr-1.5" />
          Overdue
        </span>
      );
    default:
      return (
        <span className={getBadgeClasses("bg-gray-50 text-gray-700")}>
          <Clock className="w-4 h-4 mr-1.5" />
          Pending
        </span>
      );
  }
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
};
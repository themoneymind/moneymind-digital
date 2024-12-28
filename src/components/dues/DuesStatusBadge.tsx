import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, Percent, Calendar, AlertCircle, Clock } from "lucide-react";
import { format } from "date-fns";
import { DueTransaction } from "@/types/dues";

type DuesStatusBadgeProps = {
  transaction: DueTransaction;
};

export const DuesStatusBadge = ({ transaction }: DuesStatusBadgeProps) => {
  const status = transaction.status || 'pending';

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
          Partially Paid ({formatCurrency(transaction.remaining_balance || 0)} remaining)
        </Badge>
      );
    case 'payment_scheduled':
      return (
        <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">
          <Calendar className="w-3 h-3 mr-1" />
          Scheduled ({format(new Date(transaction.repayment_date || ''), 'PP')})
        </Badge>
      );
    case 'rejected':
      return (
        <Badge className="bg-red-100 text-red-800 hover:bg-red-200">
          <XCircle className="w-3 h-3 mr-1" />
          Rejected
        </Badge>
      );
    case 'overdue':
      return (
        <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-200">
          <AlertCircle className="w-3 h-3 mr-1" />
          Overdue
        </Badge>
      );
    default:
      return (
        <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200">
          <Clock className="w-3 h-3 mr-1" />
          Pending
        </Badge>
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
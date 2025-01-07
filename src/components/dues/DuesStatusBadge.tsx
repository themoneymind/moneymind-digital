import { DueTransaction } from "@/types/dues";

export const DuesStatusBadge = ({ transaction }: { transaction: DueTransaction }) => {
  const getStatusStyles = () => {
    switch (transaction.status) {
      case 'completed':
        return 'bg-green-100 text-green-700';
      case 'rejected':
        return 'bg-red-100 text-red-700';
      case 'partially_paid':
        return 'bg-yellow-100 text-yellow-700';
      case 'payment_scheduled':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusText = () => {
    switch (transaction.status) {
      case 'completed':
        return 'Completed';
      case 'rejected':
        return 'Rejected';
      case 'partially_paid':
        return 'Partially Paid';
      case 'payment_scheduled':
        return 'Scheduled';
      default:
        return 'Pending';
    }
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusStyles()}`}>
      {getStatusText()}
    </span>
  );
};
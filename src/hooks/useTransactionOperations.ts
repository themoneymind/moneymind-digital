import { Transaction } from "@/types/transactions";
import { PaymentSource } from "@/types/finance";
import { useTransactionAdd } from "./transaction/useTransactionAdd";
import { useTransactionEdit } from "./transaction/useTransactionEdit";
import { useTransactionDelete } from "./transaction/useTransactionDelete";

export const useTransactionOperations = (
  paymentSources: PaymentSource[],
  refreshData: () => Promise<void>
) => {
  const { addTransaction } = useTransactionAdd(paymentSources, refreshData);
  const { editTransaction } = useTransactionEdit(paymentSources, refreshData);
  const { deleteTransaction } = useTransactionDelete(paymentSources, refreshData);

  return {
    addTransaction,
    editTransaction,
    deleteTransaction,
  };
};
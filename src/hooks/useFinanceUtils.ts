import { PaymentSource } from "@/types/finance";
import { Transaction } from "@/types/finance";

export const useFinanceUtils = (
  paymentSources: PaymentSource[],
  transactions: Transaction[]
) => {
  const getFormattedPaymentSources = () => {
    const formattedSources: { id: string; name: string }[] = [];
    
    paymentSources.forEach(source => {
      formattedSources.push({
        id: source.id,
        name: source.name
      });

      if (source.linked && source.upi_apps && source.upi_apps.length > 0) {
        source.upi_apps.forEach(upiApp => {
          formattedSources.push({
            id: `${source.id}-${upiApp.toLowerCase()}`,
            name: `${source.name} ${upiApp}`
          });
        });
      }
    });

    return formattedSources;
  };

  const getTransactionsBySource = (sourceId: string) => {
    return transactions.filter(transaction => transaction.source === sourceId);
  };

  return {
    getFormattedPaymentSources,
    getTransactionsBySource,
  };
};

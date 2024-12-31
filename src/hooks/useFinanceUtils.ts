import { PaymentSource } from "@/types/finance";
import { Transaction } from "@/types/transactions";

export const useFinanceUtils = (
  paymentSources: PaymentSource[],
  transactions: Transaction[]
) => {
  const getFormattedPaymentSources = () => {
    console.log("getFormattedPaymentSources - Input sources:", paymentSources);
    
    const formattedSources: { id: string; name: string }[] = [];
    
    paymentSources.forEach(source => {
      // Use display_name if available, otherwise use the original name
      const displayName = source.display_name || source.name;
      
      // Add the main source
      formattedSources.push({
        id: source.id,
        name: displayName
      });

      // Add UPI variations if they exist, preserving exact names
      if (source.linked && source.upi_apps && source.upi_apps.length > 0) {
        source.upi_apps.forEach(upiApp => {
          formattedSources.push({
            id: `${source.id}-${upiApp.toLowerCase()}`,
            name: `${displayName} ${upiApp}`
          });
        });
      }
    });

    console.log("getFormattedPaymentSources - Output:", formattedSources);
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
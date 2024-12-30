import { PaymentSource } from "@/types/finance";
import { Transaction } from "@/types/transactions";

export const useFinanceUtils = (
  paymentSources: PaymentSource[],
  transactions: Transaction[]
) => {
  const formatSourceName = (sourceName: string, isUpi: boolean = false, upiApp?: string) => {
    // Remove any numbers or special characters
    const cleanName = sourceName.replace(/[0-9]+|[^\w\s]/g, '').trim();
    
    // For UPI apps, remove "Bank" and append the UPI app name
    if (isUpi && upiApp) {
      return `${cleanName.replace(/\s*bank\s*/i, '')} ${upiApp}`;
    }
    
    // For regular bank names, ensure they end with "Bank"
    return cleanName.toLowerCase().includes('bank') 
      ? cleanName 
      : `${cleanName} Bank`;
  };

  const getFormattedPaymentSources = () => {
    const formattedSources: { id: string; name: string }[] = [];
    
    paymentSources.forEach(source => {
      // Add the main bank source
      formattedSources.push({
        id: source.id,
        name: formatSourceName(source.name)
      });

      // Add UPI variations if they exist
      if (source.linked && source.upi_apps && source.upi_apps.length > 0) {
        source.upi_apps.forEach(upiApp => {
          formattedSources.push({
            id: `${source.id}-${upiApp.toLowerCase()}`,
            name: formatSourceName(source.name, true, upiApp)
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
    formatSourceName, // Export this so other components can use it directly
  };
};
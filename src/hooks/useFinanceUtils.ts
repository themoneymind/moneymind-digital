import { PaymentSource } from "@/types/finance";
import { Transaction } from "@/types/transactions";

export const useFinanceUtils = (
  paymentSources: PaymentSource[],
  transactions: Transaction[]
) => {
  const formatSourceName = (sourceName: string, isUpi: boolean = false, upiApp?: string) => {
    // First, remove any UUID parts that might be in the name
    const cleanName = sourceName.replace(/[a-f0-9]{4,}/gi, '').trim();
    
    // Then remove any remaining numbers and special characters
    const finalName = cleanName.replace(/[0-9]+|[^\w\s]/g, '').trim();
    
    // For UPI apps, remove "Bank" and append the UPI app name
    if (isUpi && upiApp) {
      return `${finalName.replace(/\s*bank\s*/i, '')} ${upiApp}`;
    }
    
    // For regular bank names, ensure they end with "Bank"
    return finalName.toLowerCase().includes('bank') 
      ? finalName 
      : `${finalName} Bank`;
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
    formatSourceName,
  };
};
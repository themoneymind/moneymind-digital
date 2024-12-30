import { PaymentSource } from "@/types/finance";
import { Transaction } from "@/types/transactions";

export const useFinanceUtils = (
  paymentSources: PaymentSource[],
  transactions: Transaction[]
) => {
  const formatSourceName = (sourceName: string, isUpi: boolean = false, upiApp?: string) => {
    // Remove any UUID-like patterns and clean up the name
    const cleanName = sourceName
      .replace(/[a-f0-9]{4,}/gi, '')  // Remove UUID-like patterns
      .replace(/\s+/g, ' ')           // Normalize spaces
      .trim();
    
    // For UPI apps, remove "Bank" and append the UPI app name if provided
    if (isUpi) {
      const nameWithoutBank = cleanName.replace(/\s*bank\s*/i, '');
      return upiApp ? `${nameWithoutBank} ${upiApp}` : nameWithoutBank;
    }
    
    // For regular bank names, ensure they end with "Bank"
    return cleanName.toLowerCase().includes('bank') 
      ? cleanName 
      : `${cleanName} Bank`;
  };

  const getFormattedPaymentSources = () => {
    const formattedSources: { id: string; name: string }[] = [];
    
    paymentSources.forEach(source => {
      // Use display_name if available, otherwise fall back to formatted name
      const displayName = source.display_name || formatSourceName(source.name);
      
      // Add the main bank source
      formattedSources.push({
        id: source.id,
        name: displayName
      });

      // Add UPI variations if they exist
      if (source.linked && source.upi_apps && source.upi_apps.length > 0) {
        source.upi_apps.forEach(upiApp => {
          const upiDisplayName = formatSourceName(source.name, true, upiApp);
            
          formattedSources.push({
            id: `${source.id}-${upiApp.toLowerCase()}`,
            name: upiDisplayName
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
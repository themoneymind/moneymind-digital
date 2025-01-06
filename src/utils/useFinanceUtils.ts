import { PaymentSource } from "@/types/finance";
import { Transaction } from "@/types/transactions";

export const useFinanceUtils = (
  paymentSources: PaymentSource[],
  transactions: Transaction[]
) => {
  const formatSourceName = (sourceName: string, isUpi: boolean = false, upiApp?: string) => {
    console.log("formatSourceName - Input:", { sourceName, isUpi, upiApp });
    
    // Remove any UUID-like patterns and clean up the name
    const cleanName = sourceName
      .replace(/[a-f0-9]{4,}/gi, '')  // Remove UUID-like patterns
      .replace(/\s+/g, ' ')           // Normalize spaces
      .trim();
    
    // For UPI apps, remove "Bank" and append the UPI app name if provided
    if (isUpi) {
      const nameWithoutBank = cleanName.replace(/\s*bank\s*/i, '');
      const finalName = upiApp ? `${nameWithoutBank} ${upiApp}` : nameWithoutBank;
      console.log("formatSourceName - UPI name result:", finalName);
      return finalName;
    }
    
    // For regular bank names, ensure they end with "Bank"
    const finalName = cleanName.toLowerCase().includes('bank') 
      ? cleanName 
      : `${cleanName} Bank`;
    
    console.log("formatSourceName - Bank name result:", finalName);
    return finalName;
  };

  const getFormattedPaymentSources = () => {
    console.log("getFormattedPaymentSources - Input sources:", paymentSources);
    
    const formattedSources: { id: string; name: string }[] = [];
    
    paymentSources.forEach(source => {
      // Use display_name if available, otherwise format based on type
      if (source.display_name) {
        formattedSources.push({
          id: source.id,
          name: source.display_name
        });
      } else {
        let displayName;
        if (source.type === "Credit Card") {
          // For credit cards, remove both "Bank" and "Credit Card" then add "Credit Card"
          displayName = `${source.name
            .replace(/\s*bank\s*/i, '')
            .replace(/\s*credit\s*card\s*/i, '')} Credit Card`;
        } else {
          // For bank accounts, remove both "Bank" and "Credit Card" then add "Bank"
          displayName = `${source.name
            .replace(/\s*bank\s*/i, '')
            .replace(/\s*credit\s*card\s*/i, '')} Bank`;
        }
        
        formattedSources.push({
          id: source.id,
          name: displayName.trim()
        });
      }

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

    console.log("getFormattedPaymentSources - Output:", formattedSources);
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
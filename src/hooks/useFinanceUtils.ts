export const useFinanceUtils = (
  paymentSources: PaymentSource[],
  transactions: Transaction[]
) => {
  const formatSourceName = (sourceName: string, isUpi: boolean = false, upiApp?: string) => {
    // Use the display_name from the database if available
    const cleanName = sourceName.replace(/[a-f0-9]{4,}/gi, '').trim();
    
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
          const upiDisplayName = source.display_name 
            ? `${source.display_name.replace(/\s*bank\s*/i, '')} ${upiApp}`
            : formatSourceName(source.name, true, upiApp);
            
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
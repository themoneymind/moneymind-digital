import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

type PaymentSourceSelectorProps = {
  source: string;
  onSourceChange: (source: string) => void;
  formattedSources: { id: string; name: string }[];
  placeholder?: string;
  isTransferTo?: boolean;
  fromSource?: string;
};

export const PaymentSourceSelector = ({
  source,
  onSourceChange,
  formattedSources,
  placeholder = "Select payment source",
  isTransferTo = false,
  fromSource = "",
}: PaymentSourceSelectorProps) => {
  const navigate = useNavigate();
  
  const filterSourcesForTransfer = (sources: { id: string; name: string }[], fromSourceId: string) => {
    if (!isTransferTo || !fromSourceId) return sources;

    // Find the selected "from" source details
    const fromSourceDetails = sources.find(s => s.id === fromSourceId);
    if (!fromSourceDetails) return sources;

    const isFromUpi = fromSourceDetails.name.toLowerCase().includes('gpay') || 
                     fromSourceDetails.name.toLowerCase().includes('phonepe') ||
                     fromSourceDetails.name.toLowerCase().includes('cred') ||
                     fromSourceDetails.name.toLowerCase().includes('ippopay');

    const baseBank = isFromUpi 
      ? fromSourceDetails.name.split(' ')[0] // Get bank name from UPI (e.g., "HDFC" from "HDFC GPay")
      : fromSourceDetails.name.replace(/ Bank.*$/, ''); // Get bank name from bank account

    return sources.filter(s => {
      // Don't filter out the same source if it's a credit card
      const isCreditCard = s.name.toLowerCase().includes('credit card');
      if (isCreditCard) return true;

      const isUpi = s.name.toLowerCase().includes('gpay') || 
                   s.name.toLowerCase().includes('phonepe') ||
                   s.name.toLowerCase().includes('cred') ||
                   s.name.toLowerCase().includes('ippopay');
      
      const sameBank = s.name.startsWith(baseBank);

      // If from source is a UPI, filter out:
      // - The UPI itself
      // - Other UPIs from same bank
      if (isFromUpi) {
        if (s.id === fromSourceId) return false;
        if (isUpi && sameBank) return false;
        return true;
      }

      // If from source is a bank account, filter out:
      // - The bank account itself
      // - All UPIs from this bank
      if (s.id === fromSourceId) return false;
      if (sameBank && isUpi) return false;
      return true;
    });
  };

  const handleSourceChange = (newSource: string) => {
    console.log("PaymentSourceSelector - Source changed to:", newSource);
    console.log("PaymentSourceSelector - Selected source details:", 
      formattedSources.find(s => s.id === newSource)
    );
    onSourceChange(newSource);
  };

  const filteredSources = filterSourcesForTransfer(formattedSources, fromSource);

  return (
    <div className="flex gap-2">
      <Select value={source} onValueChange={handleSourceChange}>
        <SelectTrigger className="h-10 border-gray-200 rounded-xl text-sm">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent className="bg-white border border-gray-200 shadow-lg rounded-xl">
          {filteredSources.map((source) => (
            <SelectItem 
              key={source.id} 
              value={source.id}
              className="hover:bg-gray-50 text-sm"
            >
              {source.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button
        type="button"
        variant="outline"
        size="icon"
        className="h-10 w-10 border-gray-200 rounded-xl flex-shrink-0"
        onClick={() => navigate("/app/payment-source")}
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
};
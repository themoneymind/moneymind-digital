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

    // Check if the source is a UPI app
    const isFromUpi = fromSourceDetails.name.toLowerCase().includes('gpay') || 
                     fromSourceDetails.name.toLowerCase().includes('phonepe') ||
                     fromSourceDetails.name.toLowerCase().includes('cred') ||
                     fromSourceDetails.name.toLowerCase().includes('ippopay');

    // Extract bank name (e.g., "HDFC" from "HDFC GPay" or "HDFC Bank")
    const bankName = fromSourceDetails.name.split(' ')[0];

    return sources.filter(s => {
      // Don't show the source itself
      if (s.id === fromSourceId) return false;

      const isUpi = s.name.toLowerCase().includes('gpay') || 
                   s.name.toLowerCase().includes('phonepe') ||
                   s.name.toLowerCase().includes('cred') ||
                   s.name.toLowerCase().includes('ippopay');
      
      const sameBank = s.name.startsWith(bankName);

      // If from source is UPI, don't show:
      // - Same bank's UPI apps
      // - The bank account itself
      if (isFromUpi) {
        if (sameBank && (isUpi || s.name.includes('Bank'))) return false;
      }

      return true;
    });
  };

  const filteredSources = filterSourcesForTransfer(formattedSources, fromSource);

  return (
    <div className="flex gap-2">
      <Select value={source} onValueChange={onSourceChange}>
        <SelectTrigger className="h-10 border-gray-200 rounded-xl text-sm">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent className="bg-white border border-gray-200 shadow-lg">
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
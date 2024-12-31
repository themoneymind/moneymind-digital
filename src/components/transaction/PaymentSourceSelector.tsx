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
  
  // Filter sources for transfer without modifying UPI variants
  const filterSourcesForTransfer = (sources: { id: string; name: string }[], fromSourceId: string) => {
    if (!isTransferTo || !fromSourceId) return sources;
    return sources.filter(s => !s.id.startsWith(fromSourceId.split('-')[0]));
  };

  const filteredSources = filterSourcesForTransfer(formattedSources, fromSource);

  // Find the exact source with UPI variant if it exists
  const currentSource = filteredSources.find(s => s.id === source);

  return (
    <div className="flex gap-2">
      <Select 
        value={source} 
        onValueChange={onSourceChange}
        defaultValue={source}
      >
        <SelectTrigger className="h-12 border-gray-200 rounded-[12px] text-sm bg-white">
          <SelectValue placeholder={placeholder}>
            {currentSource?.name || placeholder}
          </SelectValue>
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
        className="h-12 w-12 border-gray-200 rounded-[12px] flex-shrink-0"
        onClick={() => navigate("/app/payment-source")}
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
};
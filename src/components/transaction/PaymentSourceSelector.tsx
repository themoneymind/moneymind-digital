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
  initialDisplaySource?: string;
  showAddButton?: boolean;
};

export const PaymentSourceSelector = ({
  source,
  onSourceChange,
  formattedSources,
  placeholder = "Select payment source",
  isTransferTo = false,
  fromSource = "",
  initialDisplaySource,
  showAddButton = true,
}: PaymentSourceSelectorProps) => {
  const navigate = useNavigate();
  
  const filterSourcesForTransfer = (sources: { id: string; name: string }[], fromSourceId: string) => {
    if (!isTransferTo || !fromSourceId) return sources;
    return sources.filter(s => !s.id.startsWith(fromSourceId.split('-')[0]));
  };

  const filteredSources = filterSourcesForTransfer(formattedSources, fromSource);

  return (
    <div className="flex gap-2 items-center">
      <select
        value={source || ""}
        onChange={(e) => onSourceChange(e.target.value)}
        className="flex h-12 w-full py-2 px-0 text-sm bg-transparent border-b-2 border-gray-200 focus:border-primary focus:outline-none transition-colors"
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {filteredSources.map((source) => (
          <option key={source.id} value={source.id}>
            {source.name}
          </option>
        ))}
      </select>
      {showAddButton && (
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="h-12 w-12 border-gray-200 rounded-[12px] flex-shrink-0"
          onClick={() => navigate("/app/payment-source")}
        >
          <Plus className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

type PaymentSourceSelectorProps = {
  source: string;
  onSourceChange: (source: string) => void;
  formattedSources: { id: string; name: string }[];
  placeholder?: string;
};

export const PaymentSourceSelector = ({
  source,
  onSourceChange,
  formattedSources,
  placeholder = "Select payment source",
}: PaymentSourceSelectorProps) => {
  const navigate = useNavigate();
  
  const handleSourceChange = (newSource: string) => {
    console.log("PaymentSourceSelector - Source changed to:", newSource);
    console.log("PaymentSourceSelector - Selected source details:", 
      formattedSources.find(s => s.id === newSource)
    );
    onSourceChange(newSource);
  };

  return (
    <div className="flex gap-2">
      <Select value={source} onValueChange={handleSourceChange}>
        <SelectTrigger className="h-10 border-gray-200 rounded-xl text-sm">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent className="bg-white border border-gray-200 shadow-lg rounded-xl">
          {formattedSources.map((source) => (
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
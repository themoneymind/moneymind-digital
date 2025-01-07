import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from "react-router-dom";

type PaymentSourceSelectorProps = {
  source: string;
  onSourceChange: (source: string) => void;
  formattedSources: { id: string; name: string }[];
};

export const PaymentSourceSelector = ({
  source,
  onSourceChange,
  formattedSources,
}: PaymentSourceSelectorProps) => {
  const navigate = useNavigate();

  const handleAddSource = () => {
    navigate("/app/payment-source");
  };

  return (
    <div className="flex gap-2">
      <Select value={source} onValueChange={onSourceChange}>
        <SelectTrigger className="w-full h-14 border-gray-200 rounded-[12px]">
          <SelectValue placeholder="Select payment source" />
        </SelectTrigger>
        <SelectContent className="rounded-[12px] bg-white border-gray-200">
          {formattedSources.map((src) => (
            <SelectItem key={src.id} value={src.id}>
              {src.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button 
        size="icon" 
        variant="outline" 
        className="h-14 w-14 border-gray-200 rounded-[12px]"
        onClick={handleAddSource}
      >
        <Plus className="w-5 h-5" />
      </Button>
    </div>
  );
};
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link } from "react-router-dom";
import { useFinance } from "@/contexts/FinanceContext";

type PaymentSourceSelectorProps = {
  value: string;
  onChange: (source: string) => void;
};

export const PaymentSourceSelector = ({
  value,
  onChange,
}: PaymentSourceSelectorProps) => {
  const { getFormattedPaymentSources } = useFinance();
  const formattedSources = getFormattedPaymentSources();

  return (
    <div className="flex gap-2">
      <Select value={value} onValueChange={onChange}>
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
      <Link to="/payment-source">
        <Button size="icon" variant="outline" className="h-14 w-14 border-gray-200 rounded-[12px]">
          <Plus className="w-5 h-5" />
        </Button>
      </Link>
    </div>
  );
};
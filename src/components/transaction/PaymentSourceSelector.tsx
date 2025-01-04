import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getBaseSourceId } from "@/utils/paymentSourceUtils";
import { PaymentSource } from "@/types/finance";

type PaymentSourceSelectorProps = {
  source: string;
  onSourceChange: (source: string) => void;
  formattedSources: { id: string; name: string }[];
  placeholder?: string;
  isTransferTo?: boolean;
  fromSource?: string;
  initialDisplaySource?: string;
  showAddButton?: boolean;
  type?: "expense" | "income" | "transfer";
  allSources?: PaymentSource[];
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
  type,
  allSources = [],
}: PaymentSourceSelectorProps) => {
  const navigate = useNavigate();
  
  const filterSourcesForTransfer = (sources: { id: string; name: string }[], fromSourceId: string) => {
    if (!isTransferTo || !fromSourceId) return sources;
    
    const baseFromSourceId = getBaseSourceId(fromSourceId);
    const fromSourceDetails = allSources.find(s => s.id === baseFromSourceId);
    
    return sources.filter(s => {
      const baseCurrentId = getBaseSourceId(s.id);
      const currentSourceDetails = allSources.find(src => src.id === baseCurrentId);
      
      // If it's the same base source, only allow if the destination is a credit card
      if (baseCurrentId === baseFromSourceId) {
        return currentSourceDetails?.type === 'credit';
      }
      
      return true;
    });
  };

  const filteredSources = filterSourcesForTransfer(formattedSources, fromSource);

  const getFocusColor = () => {
    switch (type) {
      case 'expense':
        return 'focus:border-transaction-expense';
      case 'income':
        return 'focus:border-transaction-income';
      case 'transfer':
        return 'focus:border-transaction-transfer';
      default:
        return 'focus:border-primary';
    }
  };

  const shouldShowAddButton = showAddButton && !(type === 'transfer' && !isTransferTo);

  console.log("PaymentSourceSelector - Current source:", source);
  console.log("PaymentSourceSelector - Available sources:", filteredSources);
  console.log("PaymentSourceSelector - From source:", fromSource);

  return (
    <div className="flex gap-2 items-center">
      <select
        value={source || ""}
        onChange={(e) => {
          console.log("Selected source ID:", e.target.value);
          onSourceChange(e.target.value);
        }}
        className={`flex h-12 w-full py-2 px-0 text-sm ${source ? 'text-gray-600' : 'text-gray-400'} bg-transparent border-b-2 border-gray-200 focus:outline-none transition-colors ${getFocusColor()} appearance-none`}
        style={{
          backgroundImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236B7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`,
          backgroundPosition: "right 0 center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "1.5em 1.5em",
          paddingRight: "2rem"
        }}
      >
        <option value="" disabled className="text-gray-400">
          {placeholder}
        </option>
        {filteredSources.map((source) => (
          <option key={source.id} value={source.id} className="text-gray-600">
            {source.name}
          </option>
        ))}
      </select>
      {shouldShowAddButton && (
        <Button
          type="button"
          variant="outline"
          size="icon"
          className={`h-10 w-10 border-gray-200 rounded-[12px] flex-shrink-0 ${
            type === 'expense' 
              ? 'hover:bg-transaction-expense hover:text-white' 
              : type === 'income'
              ? 'hover:bg-transaction-income hover:text-white'
              : type === 'transfer'
              ? 'hover:bg-transaction-transfer hover:text-white'
              : 'hover:bg-primary hover:text-white'
          }`}
          onClick={() => navigate("/app/payment-source")}
        >
          <Plus className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};
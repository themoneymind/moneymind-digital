import { Button } from "@/components/ui/button";
import { useFinance } from "@/contexts/FinanceContext";

interface PaymentSourceButtonsProps {
  onAddSource: () => Promise<void>;
  onComplete: () => void;
}

export const PaymentSourceButtons = ({ onAddSource, onComplete }: PaymentSourceButtonsProps) => {
  const { paymentSources } = useFinance();

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <Button
          className="flex-1 h-[52px] rounded-[16px] bg-[#7C3AED] hover:bg-[#7C3AED]/90 text-white font-medium"
          onClick={onAddSource}
        >
          Add Payment Source
        </Button>

        <Button
          className="flex-1 h-[52px] rounded-[16px]"
          onClick={onComplete}
          disabled={paymentSources.length === 0}
          variant={paymentSources.length === 0 ? "outline" : "default"}
        >
          Complete
        </Button>
      </div>

      <p className="text-xs text-muted-foreground text-center">
        After adding payment sources, click 'Complete' to proceed
      </p>
    </div>
  );
};
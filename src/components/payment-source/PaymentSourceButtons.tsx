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
      <Button
        className="w-full h-14 rounded-[12px]"
        onClick={onAddSource}
      >
        Add Payment Source
      </Button>

      <Button
        className="w-full h-14 rounded-[12px]"
        onClick={onComplete}
        disabled={paymentSources.length === 0}
        variant={paymentSources.length === 0 ? "outline" : "default"}
      >
        Complete
      </Button>

      <p className="text-xs text-muted-foreground text-center">
        After adding payment sources, click 'Complete' to proceed
      </p>
    </div>
  );
};
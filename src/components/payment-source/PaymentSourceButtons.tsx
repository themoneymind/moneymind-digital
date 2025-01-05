import { Button } from "@/components/ui/button";
import { useFinance } from "@/contexts/FinanceContext";

interface PaymentSourceButtonsProps {
  onAddSource: () => Promise<void>;
  onComplete: () => void;
}

export const PaymentSourceButtons = ({ onAddSource, onComplete }: PaymentSourceButtonsProps) => {
  const { paymentSources } = useFinance();

  return (
    <div className="space-y-4 px-6 pb-6">
      <Button
        className="w-full h-[52px] text-base font-medium rounded-[16px] bg-primary hover:bg-primary/90"
        onClick={onAddSource}
      >
        Add Payment Source
      </Button>

      <Button
        className={`w-full h-[52px] text-base font-medium rounded-[16px] ${
          paymentSources.length === 0
            ? "bg-muted text-muted-foreground hover:bg-muted/90"
            : "bg-primary hover:bg-primary/90"
        }`}
        onClick={onComplete}
        disabled={paymentSources.length === 0}
      >
        Complete
      </Button>

      <p className="text-xs text-muted-foreground text-center">
        After adding payment sources, click 'Complete' to proceed
      </p>
    </div>
  );
};
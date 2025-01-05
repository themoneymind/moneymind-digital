import { Button } from "@/components/ui/button";
import { useFinance } from "@/contexts/FinanceContext";

interface PaymentSourceButtonsProps {
  onAddSource: () => void;
  onComplete: () => void;
}

export const PaymentSourceButtons = ({
  onAddSource,
  onComplete,
}: PaymentSourceButtonsProps) => {
  const { paymentSources } = useFinance();

  return (
    <div className="space-y-4 px-4">
      <Button
        className="w-full h-[52px] rounded-[16px] bg-[#7C3AED] hover:bg-[#7C3AED]/90 text-white font-medium"
        onClick={onAddSource}
      >
        Add Payment Source
      </Button>

      <Button
        className="w-full h-[52px] rounded-[16px]"
        onClick={onComplete}
        disabled={paymentSources.length === 0}
        variant={paymentSources.length === 0 ? "outline" : "default"}
      >
        Complete
      </Button>
    </div>
  );
};
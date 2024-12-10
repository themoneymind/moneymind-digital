import { Button } from "@/components/ui/button";

type PaymentSourceTypeSelectorProps = {
  selectedType: "bank" | "credit";
  onTypeChange: (type: "bank" | "credit") => void;
};

export const PaymentSourceTypeSelector = ({
  selectedType,
  onTypeChange,
}: PaymentSourceTypeSelectorProps) => {
  return (
    <div className="flex gap-2 mb-6">
      <Button
        variant="outline"
        className={`flex-1 h-14 rounded-[12px] ${
          selectedType === "bank"
            ? "bg-primary text-primary-foreground hover:bg-primary/90"
            : ""
        }`}
        onClick={() => onTypeChange("bank")}
      >
        Bank Account
      </Button>
      <Button
        variant="outline"
        className={`flex-1 h-14 rounded-[12px] ${
          selectedType === "credit"
            ? "bg-primary text-primary-foreground hover:bg-primary/90"
            : ""
        }`}
        onClick={() => onTypeChange("credit")}
      >
        Credit Card
      </Button>
    </div>
  );
};
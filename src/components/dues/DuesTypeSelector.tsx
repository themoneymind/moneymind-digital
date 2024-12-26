import { Button } from "@/components/ui/button";

type DuesTypeSelectorProps = {
  type: "given" | "received";
  onTypeChange: (type: "given" | "received") => void;
};

export const DuesTypeSelector = ({
  type,
  onTypeChange,
}: DuesTypeSelectorProps) => {
  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        className={`flex-1 h-14 rounded-[12px] ${
          type === "given"
            ? "bg-primary text-primary-foreground hover:bg-primary/90"
            : ""
        }`}
        onClick={() => onTypeChange("given")}
      >
        Given
      </Button>
      <Button
        variant="outline"
        className={`flex-1 h-14 rounded-[12px] ${
          type === "received"
            ? "bg-primary text-primary-foreground hover:bg-primary/90"
            : ""
        }`}
        onClick={() => onTypeChange("received")}
      >
        Received
      </Button>
    </div>
  );
};
import { Button } from "@/components/ui/button";
import { ArrowDown, ArrowUp } from "lucide-react";

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
        className={`flex-1 h-14 rounded-[12px] gap-2 ${
          type === "given"
            ? "bg-red-50 text-red-500 border-red-100 hover:bg-red-50"
            : "bg-white hover:bg-gray-50"
        }`}
        onClick={() => onTypeChange("given")}
      >
        <ArrowDown className="w-4 h-4" />
        Given
      </Button>
      <Button
        variant="outline"
        className={`flex-1 h-14 rounded-[12px] gap-2 ${
          type === "received"
            ? "bg-green-50 text-green-500 border-green-100 hover:bg-green-50"
            : "bg-white hover:bg-gray-50"
        }`}
        onClick={() => onTypeChange("received")}
      >
        <ArrowUp className="w-4 h-4" />
        Received
      </Button>
    </div>
  );
};
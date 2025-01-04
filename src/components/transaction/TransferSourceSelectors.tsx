import { PaymentSourceSelector } from "./PaymentSourceSelector";
import { useState } from "react";
import { getBaseSourceId } from "@/utils/paymentSourceUtils";
import { useFinance } from "@/contexts/FinanceContext";

type TransferSourceSelectorsProps = {
  source: string;
  onSourceChange: (source: string) => void;
  formattedSources: { id: string; name: string }[];
};

export const TransferSourceSelectors = ({
  source,
  onSourceChange,
  formattedSources,
}: TransferSourceSelectorsProps) => {
  const [fromSource, setFromSource] = useState("");
  const [toSource, setToSource] = useState("");
  const { paymentSources } = useFinance();

  const handleFromSourceChange = (newSource: string) => {
    console.log("From source changed:", { newSource });
    setFromSource(newSource);
    // Only update parent state when "from" source changes
    onSourceChange(newSource);
  };

  const handleToSourceChange = (newSource: string) => {
    console.log("To source changed:", { newSource });
    setToSource(newSource);
    // Update parent state with destination account
    onSourceChange(newSource);
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      <PaymentSourceSelector
        source={fromSource}
        onSourceChange={handleFromSourceChange}
        formattedSources={formattedSources}
        placeholder="Transfer from"
        type="transfer"
        showAddButton={false}
        allSources={paymentSources}
      />
      <PaymentSourceSelector
        source={toSource}
        onSourceChange={handleToSourceChange}
        formattedSources={formattedSources}
        placeholder="Transfer to"
        isTransferTo={true}
        fromSource={fromSource}
        type="transfer"
        allSources={paymentSources}
      />
    </div>
  );
};
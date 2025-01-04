import { PaymentSourceSelector } from "./PaymentSourceSelector";
import { useState } from "react";
import { getBaseSourceId } from "@/utils/paymentSourceUtils";

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

  const handleFromSourceChange = (newSource: string) => {
    const baseSourceId = getBaseSourceId(newSource);
    console.log("From source changed:", { newSource, baseSourceId });
    setFromSource(newSource);
    // Only update parent state when "from" source changes with the base ID
    onSourceChange(baseSourceId);
  };

  const handleToSourceChange = (newSource: string) => {
    const baseSourceId = getBaseSourceId(newSource);
    console.log("To source changed:", { newSource, baseSourceId });
    setToSource(newSource);
    // Update parent state with destination account base ID
    onSourceChange(baseSourceId);
  };

  const getFilteredDestinationSources = () => {
    if (!fromSource) return formattedSources;
    // Filter out the source account and its related UPI sources
    const baseSourceId = getBaseSourceId(fromSource);
    return formattedSources.filter(s => !s.id.startsWith(baseSourceId));
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
      />
      <PaymentSourceSelector
        source={toSource}
        onSourceChange={handleToSourceChange}
        formattedSources={getFilteredDestinationSources()}
        placeholder="Transfer to"
        isTransferTo={true}
        fromSource={fromSource}
        type="transfer"
      />
    </div>
  );
};
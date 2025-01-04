import { PaymentSourceSelector } from "./PaymentSourceSelector";
import { useState } from "react";

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
    setFromSource(newSource);
    // Only update parent state when "from" source changes
    onSourceChange(newSource);
  };

  const handleToSourceChange = (newSource: string) => {
    setToSource(newSource);
    // Update parent state with destination account
    onSourceChange(newSource);
  };

  const getFilteredDestinationSources = () => {
    if (!fromSource) return formattedSources;
    // Filter out the source account and its related UPI sources
    const baseSourceId = fromSource.split('-')[0];
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
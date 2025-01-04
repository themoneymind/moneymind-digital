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
  const [transferToSource, setTransferToSource] = useState("");

  const handleTransferFromChange = (newSource: string) => {
    onSourceChange(newSource);
    // Reset transfer to source when transfer from changes
    setTransferToSource("");
  };

  const handleTransferToChange = (newSource: string) => {
    // Only update the transferToSource state, not the main source
    setTransferToSource(newSource);
  };

  const getFilteredSources = () => {
    if (!source) return formattedSources;
    // Filter out sources that start with the same base ID as the "from" source
    const baseSourceId = source.split('-')[0];
    return formattedSources.filter(s => !s.id.startsWith(baseSourceId));
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      <PaymentSourceSelector
        source={source}
        onSourceChange={handleTransferFromChange}
        formattedSources={formattedSources}
        placeholder="Transfer from"
        type="transfer"
        showAddButton={false}
      />
      <PaymentSourceSelector
        source={transferToSource}
        onSourceChange={handleTransferToChange}
        formattedSources={getFilteredSources()}
        placeholder="Transfer to"
        isTransferTo={true}
        fromSource={source}
        type="transfer"
      />
    </div>
  );
};
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
    setTransferToSource("");
  };

  const handleTransferToChange = (newSource: string) => {
    setTransferToSource(newSource);
    onSourceChange(newSource);
  };

  const getFilteredSources = () => {
    if (!source) return formattedSources;
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
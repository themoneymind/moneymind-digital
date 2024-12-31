import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type PaymentSourceSelectorProps = {
  source: string;
  onSourceChange: (source: string) => void;
  formattedSources: { id: string; name: string }[];
};

export const PaymentSourceSelector = ({
  source,
  onSourceChange,
  formattedSources,
}: PaymentSourceSelectorProps) => {
  console.log("PaymentSourceSelector - Current source:", source);
  console.log("PaymentSourceSelector - Available sources:", formattedSources);

  const handleSourceChange = (newSource: string) => {
    console.log("PaymentSourceSelector - Source changed to:", newSource);
    console.log("PaymentSourceSelector - Selected source details:", 
      formattedSources.find(s => s.id === newSource)
    );
    onSourceChange(newSource);
  };

  const currentSource = formattedSources.find(s => s.id === source);
  const effectiveSource = currentSource ? source : formattedSources[0]?.id;

  return (
    <Select value={effectiveSource} onValueChange={handleSourceChange}>
      <SelectTrigger className="h-10 border-gray-200 rounded-xl">
        <SelectValue placeholder="Select payment source" />
      </SelectTrigger>
      <SelectContent className="bg-white border border-gray-200 shadow-lg rounded-xl z-50">
        {formattedSources.map((source) => (
          <SelectItem 
            key={source.id} 
            value={source.id}
            className="hover:bg-gray-50"
          >
            {source.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type PaymentSourceSelectorProps = {
  source: string;
  onSourceChange: (source: string) => void;
  formattedSources: { id: string; name: string }[];
  placeholder?: string;
};

export const PaymentSourceSelector = ({
  source,
  onSourceChange,
  formattedSources,
  placeholder = "Select payment source",
}: PaymentSourceSelectorProps) => {
  const handleSourceChange = (newSource: string) => {
    console.log("PaymentSourceSelector - Source changed to:", newSource);
    console.log("PaymentSourceSelector - Selected source details:", 
      formattedSources.find(s => s.id === newSource)
    );
    onSourceChange(newSource);
  };

  return (
    <Select value={source} onValueChange={handleSourceChange}>
      <SelectTrigger className="h-10 border-gray-200 rounded-xl text-sm">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent className="bg-white border border-gray-200 shadow-lg rounded-xl">
        {formattedSources.map((source) => (
          <SelectItem 
            key={source.id} 
            value={source.id}
            className="hover:bg-gray-50 text-sm"
          >
            {source.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
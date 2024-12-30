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
  return (
    <Select value={source} onValueChange={onSourceChange}>
      <SelectTrigger className="h-14 border-gray-200 rounded-[12px]">
        <SelectValue placeholder="Select payment source" />
      </SelectTrigger>
      <SelectContent className="bg-white border border-gray-200 shadow-lg rounded-[12px] z-50">
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
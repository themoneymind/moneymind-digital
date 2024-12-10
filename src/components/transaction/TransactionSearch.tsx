import { Input } from "@/components/ui/input";

type TransactionSearchProps = {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
};

export const TransactionSearch = ({ 
  searchQuery, 
  setSearchQuery 
}: TransactionSearchProps) => {
  return (
    <div className="mb-4">
      <Input
        type="text"
        placeholder="Search transactions..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full"
      />
    </div>
  );
};
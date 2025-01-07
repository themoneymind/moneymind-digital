import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

type TransactionSearchProps = {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
};

export const TransactionSearch = ({ 
  searchQuery, 
  setSearchQuery 
}: TransactionSearchProps) => {
  return (
    <div className="mb-4 relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
      <Input
        type="text"
        placeholder="Search transactions..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full pl-9 md:text-sm text-base"
      />
    </div>
  );
};
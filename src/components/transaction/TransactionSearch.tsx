import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

type TransactionSearchProps = {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
};

export const TransactionSearch = ({ searchQuery, setSearchQuery }: TransactionSearchProps) => {
  return (
    <div className="relative mb-4">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
      <Input
        className="pl-9 h-10 border-gray-200 rounded-apple text-sm"
        placeholder="Search transactions..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
    </div>
  );
};
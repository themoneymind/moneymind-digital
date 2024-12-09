import { Button } from "@/components/ui/button";

type TransactionFiltersProps = {
  filter: "all" | "income" | "expense";
  setFilter: (filter: "all" | "income" | "expense") => void;
};

export const TransactionFilters = ({ filter, setFilter }: TransactionFiltersProps) => {
  return (
    <div className="flex gap-2 mb-4">
      <Button
        className={`rounded-apple px-4 py-1.5 text-sm ${
          filter === "all" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600"
        }`}
        variant={filter === "all" ? "default" : "outline"}
        onClick={() => setFilter("all")}
      >
        All
      </Button>
      <Button
        className={`rounded-apple px-4 py-1.5 text-sm ${
          filter === "income" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600"
        }`}
        variant={filter === "income" ? "default" : "outline"}
        onClick={() => setFilter("income")}
      >
        Income
      </Button>
      <Button
        className={`rounded-apple px-4 py-1.5 text-sm ${
          filter === "expense" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600"
        }`}
        variant={filter === "expense" ? "default" : "outline"}
        onClick={() => setFilter("expense")}
      >
        Expense
      </Button>
    </div>
  );
};
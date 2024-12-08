import { Search, MoreVertical } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useFinance } from "@/contexts/FinanceContext";
import { useState } from "react";
import { format } from "date-fns";

export const RecentTransactions = () => {
  const { transactions } = useFinance();
  const [filter, setFilter] = useState<"all" | "income" | "expense">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesFilter =
      filter === "all" ? true : transaction.type === filter;
    const matchesSearch = transaction.category
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="p-4 mx-4 bg-white rounded-xl">
      <h2 className="mb-4 text-lg font-semibold">Recent Transactions</h2>
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          className="pl-10"
          placeholder="Search transactions..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <div className="flex gap-2 mb-4">
        <Button
          className={filter === "all" ? "bg-blue-600" : ""}
          variant={filter === "all" ? "default" : "outline"}
          onClick={() => setFilter("all")}
        >
          All
        </Button>
        <Button
          variant={filter === "income" ? "default" : "outline"}
          onClick={() => setFilter("income")}
        >
          Income
        </Button>
        <Button
          variant={filter === "expense" ? "default" : "outline"}
          onClick={() => setFilter("expense")}
        >
          Expense
        </Button>
      </div>
      <div className="space-y-4">
        {filteredTransactions.map((transaction) => (
          <div key={transaction.id} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  transaction.type === "expense"
                    ? "bg-red-100 text-red-500"
                    : "bg-green-100 text-green-500"
                }`}
              >
                <span>{transaction.category[0]}</span>
              </div>
              <div>
                <p className="font-medium">{transaction.category}</p>
                <p className="text-sm text-gray-500">
                  {format(transaction.date, "MMM d, h:mm a")}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={
                  transaction.type === "expense" ? "text-danger" : "text-success"
                }
              >
                {transaction.type === "expense" ? "-" : "+"}
                {formatCurrency(transaction.amount)}
              </span>
              <Button variant="ghost" size="icon">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
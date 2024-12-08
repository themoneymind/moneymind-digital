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
    <div className="p-6 mx-4 bg-white rounded-apple shadow-lg">
      <h2 className="mb-6 text-lg font-semibold">Recent Transactions</h2>
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          className="pl-10 h-12 border-gray-200 rounded-apple"
          placeholder="Search transactions..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <div className="flex gap-2 mb-6">
        <Button
          className={`rounded-apple px-6 ${
            filter === "all" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600"
          }`}
          variant={filter === "all" ? "default" : "outline"}
          onClick={() => setFilter("all")}
        >
          All
        </Button>
        <Button
          className={`rounded-apple px-6 ${
            filter === "income" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600"
          }`}
          variant={filter === "income" ? "default" : "outline"}
          onClick={() => setFilter("income")}
        >
          Income
        </Button>
        <Button
          className={`rounded-apple px-6 ${
            filter === "expense" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600"
          }`}
          variant={filter === "expense" ? "default" : "outline"}
          onClick={() => setFilter("expense")}
        >
          Expense
        </Button>
      </div>
      <div className="space-y-6">
        {filteredTransactions.map((transaction) => (
          <div key={transaction.id} className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div
                className={`w-12 h-12 rounded-apple flex items-center justify-center ${
                  transaction.type === "expense"
                    ? "bg-red-50 text-red-500"
                    : "bg-green-50 text-green-500"
                }`}
              >
                <span className="text-lg">{transaction.category[0].toUpperCase()}</span>
              </div>
              <div>
                <p className="font-medium text-gray-900">{transaction.category}</p>
                <p className="text-sm text-gray-500">
                  {format(transaction.date, "MMM d, h:mm a")}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span
                className={`font-medium ${
                  transaction.type === "expense" ? "text-red-500" : "text-green-500"
                }`}
              >
                {transaction.type === "expense" ? "-" : "+"}
                {formatCurrency(transaction.amount)}
              </span>
              <Button variant="ghost" size="icon" className="hover:bg-gray-100 rounded-apple">
                <MoreVertical className="w-5 h-5 text-gray-500" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
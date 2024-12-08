import { Search, MoreVertical } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const RecentTransactions = () => {
  return (
    <div className="p-4 mx-4 bg-white rounded-xl">
      <h2 className="mb-4 text-lg font-semibold">Recent Transactions</h2>
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input className="pl-10" placeholder="Search transactions..." />
      </div>
      <div className="flex gap-2 mb-4">
        <Button className="bg-blue-600">All</Button>
        <Button variant="outline">Income</Button>
        <Button variant="outline">Expense</Button>
      </div>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <span className="text-red-500">F</span>
            </div>
            <div>
              <p className="font-medium">Food</p>
              <p className="text-sm text-gray-500">Dec 2, 8:46 PM</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-danger">-₹10,075</span>
            <Button variant="ghost" size="icon">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-green-500">S</span>
            </div>
            <div>
              <p className="font-medium">Salary</p>
              <p className="text-sm text-gray-500">Dec 2, 8:45 PM</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-success">+₹1,25,000</span>
            <Button variant="ghost" size="icon">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
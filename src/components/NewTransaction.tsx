import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const NewTransaction = () => {
  return (
    <div className="p-4 mx-4 bg-white rounded-xl">
      <h2 className="mb-4 text-lg font-semibold">New Transaction</h2>
      <div className="flex gap-2 mb-4">
        <Button variant="outline" className="flex-1 bg-danger/10 text-danger border-danger/20">
          Expense
        </Button>
        <Button variant="outline" className="flex-1">
          Income
        </Button>
      </div>
      <div className="space-y-4">
        <Input type="number" placeholder="0" className="text-2xl" />
        <Select>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Food" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="food">Food</SelectItem>
            <SelectItem value="transport">Transport</SelectItem>
            <SelectItem value="shopping">Shopping</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex items-center">
          <Select>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select payment source" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="bank">Bank Account</SelectItem>
              <SelectItem value="cash">Cash</SelectItem>
              <SelectItem value="card">Credit Card</SelectItem>
            </SelectContent>
          </Select>
          <Button size="icon" variant="ghost" className="ml-2">
            <Plus className="w-5 h-5" />
          </Button>
        </div>
        <Input placeholder="Description or note (Optional)" />
        <Button className="w-full bg-blue-600 hover:bg-blue-700">Add Transaction</Button>
      </div>
    </div>
  );
};
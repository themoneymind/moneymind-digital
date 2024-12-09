import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useFinance } from "@/contexts/FinanceContext";
import { useToast } from "@/hooks/use-toast";
import { TransactionType } from "@/types/finance";
import { TransactionTypeSelector } from "./transaction/TransactionTypeSelector";
import { CategorySelector } from "./transaction/CategorySelector";
import { PaymentSourceSelector } from "./transaction/PaymentSourceSelector";

export const NewTransaction = () => {
  const { addTransaction, getFormattedPaymentSources } = useFinance();
  const { toast } = useToast();
  const [type, setType] = useState<TransactionType>("expense");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [source, setSource] = useState("");
  const [description, setDescription] = useState("");
  const [customCategories, setCustomCategories] = useState<{
    expense: string[];
    income: string[];
  }>({
    expense: [],
    income: [],
  });

  const formattedSources = getFormattedPaymentSources();

  const handleAddCustomCategory = (newCategory: string) => {
    setCustomCategories((prev) => ({
      ...prev,
      [type]: [...prev[type], newCategory],
    }));
  };

  const handleSubmit = async () => {
    if (!amount || !category || !source) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      // Log for debugging
      console.log("Submitting transaction with source:", source);

      await addTransaction({
        type,
        amount: Number(amount),
        category,
        source, // Use the full UUID directly
        description,
      });

      // Reset form after successful submission
      setAmount("");
      setCategory("");
      setSource("");
      setDescription("");

      toast({
        title: "Success",
        description: "Transaction added successfully",
      });
    } catch (error) {
      console.error("Error adding transaction:", error);
      toast({
        title: "Error",
        description: "Failed to add transaction. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="p-6 mx-4 bg-white rounded-[20px]">
      <h2 className="mb-6 text-base font-semibold">New Transaction</h2>
      <TransactionTypeSelector type={type} onTypeChange={setType} />
      <div className="space-y-4">
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
          <Input
            type="number"
            placeholder="0"
            className="text-2xl pl-8 h-14 border-gray-200 rounded-[12px]"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>
        <CategorySelector
          type={type}
          category={category}
          onCategoryChange={setCategory}
          customCategories={customCategories}
          onAddCustomCategory={handleAddCustomCategory}
        />
        <PaymentSourceSelector
          source={source}
          onSourceChange={setSource}
          formattedSources={formattedSources}
        />
        <Input
          placeholder="Description or note (Optional)"
          className="h-14 border-gray-200 rounded-[12px]"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <Button
          className="w-full h-14 bg-blue-600 hover:bg-blue-700 rounded-[12px]"
          onClick={handleSubmit}
        >
          Add Transaction
        </Button>
      </div>
    </div>
  );
};
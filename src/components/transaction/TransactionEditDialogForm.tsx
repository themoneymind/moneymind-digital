import { useState } from "react";
import { Input } from "@/components/ui/input";
import { TransactionType } from "@/types/finance";
import { PaymentSourceSelector } from "./PaymentSourceSelector";
import { TransactionDateSelector } from "./TransactionDateSelector";
import { RepeatSelector } from "./RepeatSelector";

interface TransactionEditDialogFormProps {
  currentAmount: number;
  operation: "add" | "subtract";
  setOperation: (op: "add" | "subtract") => void;
  amount: string;
  setAmount: (amount: string) => void;
  selectedSource: string;
  setSelectedSource: (source: string) => void;
  description: string;
  setDescription: (description: string) => void;
  formattedSources: { id: string; name: string }[];
  onDropdownOpenChange: (open: boolean) => void;
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  repeatFrequency: string;
  onRepeatChange: (frequency: string) => void;
  transactionType?: TransactionType;
}

export const TransactionEditDialogForm = ({
  currentAmount,
  operation,
  setOperation,
  amount,
  setAmount,
  selectedSource,
  setSelectedSource,
  description,
  setDescription,
  formattedSources,
  onDropdownOpenChange,
  selectedDate,
  onDateChange,
  repeatFrequency,
  onRepeatChange,
  transactionType,
}: TransactionEditDialogFormProps) => {
  return (
    <div className="space-y-4">
      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
        <Input
          type="number"
          placeholder="0"
          className="text-sm pl-8 h-12 border-gray-200 rounded-[12px] bg-white"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </div>

      <PaymentSourceSelector
        source={selectedSource}
        onSourceChange={setSelectedSource}
        formattedSources={formattedSources}
        placeholder="Select payment source"
      />

      <TransactionDateSelector
        selectedDate={selectedDate}
        onDateChange={onDateChange}
      />

      <RepeatSelector
        value={repeatFrequency}
        onValueChange={onRepeatChange}
      />

      <Input
        placeholder="Add a description"
        className="h-12 border-gray-200 rounded-[12px] text-sm bg-white"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
    </div>
  );
};
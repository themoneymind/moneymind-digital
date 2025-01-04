import { useState } from "react";
import { useFinance } from "@/contexts/FinanceContext";
import { TransactionType } from "@/types/finance";
import { TransactionForm } from "./transaction/TransactionForm";
import { useTransactionValidation } from "@/hooks/useTransactionValidation";
import { TransactionHeader } from "./transaction/TransactionHeader";
import { toast } from "sonner";
import { useTransferHandler } from "@/hooks/useTransferHandler";

type NewTransactionProps = {
  onClose: () => void;
};

export const NewTransaction = ({ onClose }: NewTransactionProps) => {
  const { addTransaction, getFormattedPaymentSources, paymentSources } = useFinance();
  const { validateAmount, validatePaymentSource } = useTransactionValidation();
  const { handleTransfer } = useTransferHandler();
  
  const [type, setType] = useState<TransactionType>("expense");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [source, setSource] = useState("");
  const [description, setDescription] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [customCategories, setCustomCategories] = useState<{
    expense: string[];
    income: string[];
    transfer: string[];
  }>({
    expense: [],
    income: [],
    transfer: [],
  });

  const formattedSources = getFormattedPaymentSources();

  const handleSubmit = async () => {
    if (!category) {
      toast.error("Please select a category");
      return;
    }

    if (!source) {
      toast.error("Please select a payment source");
      return;
    }

    const validAmount = validateAmount(amount);
    if (!validAmount) return;

    const sourceValidation = validatePaymentSource(source, paymentSources);
    if (!sourceValidation) return;

    try {
      if (type === 'transfer') {
        const success = await handleTransfer(
          sourceValidation.baseSource.id,
          source, // This is actually the destination account ID
          validAmount,
          description
        );

        if (success) {
          setAmount("");
          setCategory("");
          setSource("");
          setDescription("");
          setSelectedDate(new Date());
          onClose();
        }
      } else {
        await addTransaction({
          type,
          amount: validAmount,
          category,
          source: source,
          description,
          base_source_id: sourceValidation.baseSourceId,
          display_source: formattedSources.find(s => s.id === source)?.name || '',
          date: selectedDate,
        });

        setAmount("");
        setCategory("");
        setSource("");
        setDescription("");
        setSelectedDate(new Date());
        onClose();
        toast.success("Transaction added successfully");
      }
    } catch (error) {
      console.error("Error adding transaction:", error);
      toast.error("Failed to add transaction");
    }
  };

  return (
    <div className="bg-white rounded-t-[30px] overflow-y-auto h-[95vh] min-h-[95vh]">
      <div className="mx-auto h-1 w-[36px] rounded-full bg-gray-200 my-3" />
      <div className="px-4">
        <TransactionHeader onClose={onClose} />
        <TransactionForm
          type={type}
          amount={amount}
          category={category}
          source={source}
          description={description}
          selectedDate={selectedDate}
          onTypeChange={setType}
          onAmountChange={setAmount}
          onCategoryChange={setCategory}
          onSourceChange={setSource}
          onDescriptionChange={setDescription}
          onDateChange={setSelectedDate}
          onSubmit={handleSubmit}
          customCategories={customCategories}
          formattedSources={getFormattedPaymentSources()}
        />
      </div>
    </div>
  );
};
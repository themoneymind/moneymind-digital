import { useState } from "react";
import { useFinance } from "@/contexts/FinanceContext";
import { TransactionType } from "@/types/finance";
import { TransactionForm } from "./transaction/TransactionForm";
import { useTransactionValidation } from "@/hooks/useTransactionValidation";
import { TransactionHeader } from "./transaction/TransactionHeader";
import { toast } from "sonner";

type NewTransactionProps = {
  onClose: () => void;
};

export const NewTransaction = ({ onClose }: NewTransactionProps) => {
  const { addTransaction, getFormattedPaymentSources, paymentSources } = useFinance();
  const { validateAmount, validatePaymentSource, validateExpenseBalance } = useTransactionValidation();
  
  const [type, setType] = useState<TransactionType>("expense");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [source, setSource] = useState("");
  const [destinationSource, setDestinationSource] = useState("");
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

  const validateTransactionType = (type: TransactionType): boolean => {
    const validTypes: TransactionType[] = ["expense", "income", "transfer"];
    if (!validTypes.includes(type)) {
      toast.error("Invalid transaction type");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateTransactionType(type)) return;

    if (!category) {
      toast.error("Please select a category");
      return;
    }

    if (!source) {
      toast.error("Please select a payment source");
      return;
    }

    if (type === "transfer" && !destinationSource) {
      toast.error("Please select a destination source");
      return;
    }

    const validAmount = validateAmount(amount);
    if (!validAmount) return;

    const sourceValidation = validatePaymentSource(source, paymentSources);
    if (!sourceValidation) return;

    const { baseSourceId, baseSource } = sourceValidation;

    if (!validateExpenseBalance(baseSource, validAmount, type)) return;

    let displaySourceName = "";
    if (type === "transfer") {
      const destinationSourceObj = formattedSources.find(s => s.id === destinationSource);
      if (!destinationSourceObj) {
        toast.error("Invalid destination source");
        return;
      }
      displaySourceName = destinationSourceObj.name;
    } else {
      const selectedSource = formattedSources.find(s => s.id === source);
      if (!selectedSource) {
        toast.error("Invalid payment source");
        return;
      }
      displaySourceName = selectedSource.name;
    }

    try {
      await addTransaction({
        type,
        amount: validAmount,
        category,
        source: source,
        description,
        base_source_id: baseSourceId,
        display_source: displaySourceName,
        date: selectedDate,
      });

      setAmount("");
      setCategory("");
      setSource("");
      setDestinationSource("");
      setDescription("");
      setSelectedDate(new Date());
      onClose();
      toast.success("Transaction added successfully");
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
          destinationSource={destinationSource}
          description={description}
          selectedDate={selectedDate}
          onTypeChange={setType}
          onAmountChange={setAmount}
          onCategoryChange={setCategory}
          onSourceChange={setSource}
          onDestinationSourceChange={setDestinationSource}
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
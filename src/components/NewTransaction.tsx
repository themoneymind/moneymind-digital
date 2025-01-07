import { useFinance } from "@/contexts/FinanceContext";
import { TransactionForm } from "./transaction/TransactionForm";
import { TransactionHeader } from "./transaction/TransactionHeader";
import { useTransactionForm } from "@/hooks/useTransactionForm";
import { useTransactionSubmit } from "@/hooks/useTransactionSubmit";

type NewTransactionProps = {
  onClose: () => void;
};

export const NewTransaction = ({ onClose }: NewTransactionProps) => {
  const { getFormattedPaymentSources } = useFinance();
  const {
    type,
    amount,
    category,
    source,
    destinationSource,
    description,
    selectedDate,
    customCategories,
    setType,
    setAmount,
    setCategory,
    setSource,
    setDestinationSource,
    setDescription,
    setSelectedDate,
    resetForm,
  } = useTransactionForm();

  const { handleSubmit } = useTransactionSubmit(() => {
    resetForm();
    onClose();
  });

  const onSubmit = () => {
    handleSubmit({
      type,
      amount,
      category,
      source,
      destinationSource,
      description,
      selectedDate,
    });
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
          onSubmit={onSubmit}
          customCategories={customCategories}
          formattedSources={getFormattedPaymentSources()}
        />
      </div>
    </div>
  );
};
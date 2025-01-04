type TransactionAmountInputProps = {
  amount: string;
  onAmountChange: (amount: string) => void;
};

export const TransactionAmountInput = ({
  amount,
  onAmountChange,
}: TransactionAmountInputProps) => {
  return (
    <div className="flex items-center justify-center px-4 py-2">
      <div className="inline-flex items-center">
        <span className="text-4xl font-medium text-gray-400">₹</span>
        <input
          type="number"
          value={amount}
          onChange={(e) => onAmountChange(e.target.value)}
          className="w-full text-4xl font-medium bg-transparent focus:outline-none placeholder:text-gray-400 text-gray-600 pl-1"
          placeholder="0"
        />
      </div>
    </div>
  );
};
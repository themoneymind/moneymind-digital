import { TransactionType } from "@/types/finance";

interface CategorySelectorProps {
  type: TransactionType;
  category: string;
  onCategoryChange: (category: string) => void;
  customCategories: {
    expense: string[];
    income: string[];
    transfer: string[];
  };
}

const DEFAULT_CATEGORIES = {
  expense: [
    "Food",
    "Transportation",
    "Shopping",
    "Entertainment",
    "Bills",
    "Health",
    "Education",
    "Others"
  ],
  income: [
    "Salary",
    "Business",
    "Investment",
    "Gift",
    "Others"
  ],
  transfer: [
    "Fund Transfer",
    "Credit Card Payment",
    "Transfer to Wallet",
    "Investment Transfer",
    "Loan Payment",
    "Others"
  ]
};

export const CategorySelector = ({
  type,
  category,
  onCategoryChange,
  customCategories,
}: CategorySelectorProps) => {
  const uniqueCategories = Array.from(new Set([
    ...DEFAULT_CATEGORIES[type],
    ...customCategories[type]
  ]));

  return (
    <div className="space-y-2">
      <select
        value={category}
        onChange={(e) => onCategoryChange(e.target.value)}
        className="flex h-12 w-full rounded-[12px] border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <option value="" disabled>Select category</option>
        {uniqueCategories.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>
    </div>
  );
};
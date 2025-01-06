interface BankSelectionDialogProps {
  selectedBank: string;
  onBankSelect: (bank: string) => void;
  showBankSearch: boolean;
  setShowBankSearch: (show: boolean) => void;
  banks: string[];
}

export const BankSelectionDialog = ({
  selectedBank,
  onBankSelect,
  banks,
}: BankSelectionDialogProps) => {
  return (
    <select
      value={selectedBank || ""}
      onChange={(e) => onBankSelect(e.target.value)}
      className="h-12 w-full py-2 px-0 text-sm bg-transparent border-0 border-b-2 border-gray-200 focus:outline-none focus:border-primary rounded-none font-sans text-gray-400 appearance-none"
      style={{
        backgroundImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236B7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`,
        backgroundPosition: "right 0 center",
        backgroundRepeat: "no-repeat",
        backgroundSize: "1.5em 1.5em",
        paddingRight: "2rem",
      }}
    >
      <option value="" disabled className="text-gray-400">
        Select Bank
      </option>
      {banks.map((bank) => (
        <option key={bank} value={bank} className="text-gray-600">
          {bank}
        </option>
      ))}
    </select>
  );
};
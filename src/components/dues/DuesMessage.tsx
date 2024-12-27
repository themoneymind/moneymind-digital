import { type FC } from "react";

type DuesMessageProps = {
  type: "given" | "received";
  amount: string;
  personName: string;
  upiId: string;
};

export const DuesMessage: FC<DuesMessageProps> = ({
  type,
  amount,
  personName,
  upiId,
}) => {
  if (!amount || !personName) return null;

  const formattedAmount = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(amount));

  const message = type === "given"
    ? `You'll receive ${formattedAmount} from ${personName}`
    : `You'll pay ${formattedAmount} to ${personName}`;

  const note = type === "given"
    ? "This will be recorded as 'Due Given' in your transactions"
    : "This will be recorded as 'Due Received' in your transactions";

  return (
    <div className="p-4 bg-blue-50 rounded-[12px] space-y-2">
      <p className="text-sm text-blue-700">{message}</p>
      {upiId && (
        <p className="text-xs text-blue-600">
          {type === "given" ? "Their" : "Your"} UPI/Phone: {upiId}
        </p>
      )}
      <p className="text-xs text-blue-500 italic">{note}</p>
    </div>
  );
};
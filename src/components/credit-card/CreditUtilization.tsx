import { Progress } from "@/components/ui/progress";
import { formatCurrency } from "@/utils/formatters";

interface CreditUtilizationProps {
  utilization: number;
  usedCredit: number;
  creditLimit: number;
}

export const CreditUtilization = ({ utilization, usedCredit, creditLimit }: CreditUtilizationProps) => {
  const getUtilizationColor = () => {
    if (utilization > 80) return "bg-red-500";
    if (utilization > 50) return "bg-yellow-500";
    return "bg-green-500";
  };

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium opacity-30">{utilization.toFixed(0)}%</p>
      </div>
      <div className="space-y-1">
        <Progress value={utilization} className="h-1.5 bg-white/20">
          <div 
            className={`h-full ${getUtilizationColor()} transition-all duration-300`} 
            style={{ width: `${utilization}%` }}
          />
        </Progress>
        <div className="flex justify-between text-[10px] opacity-30">
          <span>Credit Utilization {formatCurrency(usedCredit)}</span>
          <span>{formatCurrency(creditLimit)} limit</span>
        </div>
      </div>
    </div>
  );
};
import { 
  ShoppingBag, 
  Utensils, 
  Bus, 
  Briefcase, 
  Wallet,
  CreditCard,
  DollarSign,
  Building2,
  Landmark,
  Coins
} from "lucide-react";
import { LucideIcon } from "lucide-react";

type CategoryIconMap = {
  [key: string]: LucideIcon;
};

export const getCategoryIcon = (category: string): LucideIcon => {
  const categoryMap: CategoryIconMap = {
    // Expense categories
    shopping: ShoppingBag,
    food: Utensils,
    transport: Bus,
    salary: Briefcase,
    freelance: Wallet,
    investment: Landmark,
    credit: CreditCard,
    bank: Building2,
    upi: DollarSign,
    default: Coins,
  };

  const normalizedCategory = category.toLowerCase();
  return categoryMap[normalizedCategory] || categoryMap.default;
};
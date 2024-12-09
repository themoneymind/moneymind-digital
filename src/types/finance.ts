export type TransactionType = "income" | "expense";

export type Transaction = {
  id: string;
  type: TransactionType;
  amount: number;
  category: string;
  source: string;
  description?: string;
  date: Date;
  user_id: string;
  created_at: string;
  updated_at: string;
};

export type PaymentSource = {
  id: string;
  name: string;
  type: string;
  amount: number;
  linked?: boolean;
  upiApps?: string[];
};
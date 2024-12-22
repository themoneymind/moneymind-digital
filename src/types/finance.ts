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
  upi_apps?: string[];
  credit_limit?: number;
  statement_date?: string;
  due_date?: string;
  interest_rate?: number;
  last_four_digits?: string;
};
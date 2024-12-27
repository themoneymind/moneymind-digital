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
  reference_type?: string;
  reference_id?: string;
  status?: string;
  parent_transaction_id?: string;
};

export type NewTransaction = Omit<Transaction, "id" | "date" | "user_id" | "created_at" | "updated_at">;

export type PaymentSource = {
  id: string;
  user_id: string;
  name: string;
  type: string;
  amount: number;
  linked?: boolean;
  upi_apps?: string[];
  created_at: string;
  updated_at: string;
  credit_limit?: number;
  statement_date?: string;
  due_date?: string;
  interest_rate?: number;
  last_four_digits?: string;
};

export type NewPaymentSource = Omit<PaymentSource, "id" | "created_at" | "updated_at">;
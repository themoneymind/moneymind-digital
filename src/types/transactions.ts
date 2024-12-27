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
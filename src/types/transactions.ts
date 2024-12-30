export type TransactionType = "income" | "expense";

export type RepeatOption =
  | "never"
  | "daily"
  | "workdays"
  | "weekly"
  | "biweekly"
  | "triweekly"
  | "monthly"
  | "bimonthly"
  | "quarterly"
  | "firstofmonth"
  | "lastofmonth"
  | "semiannually"
  | "annually";

export type AuditTrailEntry = {
  action: string;
  timestamp: string;
};

export type Transaction = {
  id: string;
  type: TransactionType;
  amount: number;
  category: string;
  source: string; // This is used for display purposes
  description?: string;
  date: Date;
  user_id: string;
  created_at: string;
  updated_at: string;
  reference_type?: string;
  reference_id?: string;
  status?: string;
  parent_transaction_id?: string;
  audit_trail?: AuditTrailEntry[];
  previous_status?: string;
  base_source_id: string; // This is what's actually stored in the database
  display_source?: string;
  repeat_frequency?: RepeatOption;
};

export type NewTransaction = Omit<Transaction, "id" | "date" | "user_id" | "created_at" | "updated_at">;
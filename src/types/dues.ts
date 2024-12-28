import { Transaction as BaseTransaction, AuditTrailEntry } from "./transactions";

export interface DueTransaction extends BaseTransaction {
  repayment_date?: string;
  excuse_reason?: string;
  remaining_balance?: number;
  next_reminder_date?: string;
  reminder_count?: number;
  last_reminder_sent?: string;
  audit_trail?: AuditTrailEntry[];
  previous_status?: string;
}
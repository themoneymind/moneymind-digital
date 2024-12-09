export interface PaymentSource {
  id: string;
  name: string;
  type: string;
  amount: number;
  linked?: boolean;
  upiId?: string;
  upiApps?: string[];
}

export interface PaymentSourceCardProps {
  source: PaymentSource;
}
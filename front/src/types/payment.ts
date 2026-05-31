export type PaymentMethod = "cash" | "bank_transfer" | "e_wallet" | "credit_card";

export interface Payment {
  id: string;
  invoice_id: string;
  amount: number;
  payment_method: PaymentMethod;
  reference_number: string | null;
  paid_at: string;
  created_at: string;
}

export interface CreatePaymentPayload {
  invoice_id: string;
  amount: number;
  payment_method: PaymentMethod;
  reference_number?: string;
}

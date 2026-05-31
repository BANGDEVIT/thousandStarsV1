export type InvoiceStatus = "unpaid" | "partially_paid" | "paid";

export interface PaymentInInvoice {
  id: string;
  amount: number;
  payment_method: string;
  reference_number: string | null;
  paid_at: string;
}

export interface Invoice {
  id: string;
  booking_id: string;
  total_amount: number;
  discount: number;
  final_amount: number;
  status: InvoiceStatus;
  total_paid: number;
  remaining: number;
  payments: PaymentInInvoice[];
  created_at: string;
  updated_at: string;
}

export interface UpdateInvoiceDiscountPayload {
  discount: number;
}

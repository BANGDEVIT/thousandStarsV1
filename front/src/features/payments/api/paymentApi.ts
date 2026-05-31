import axiosInstance from "@/api/axiosInstance";
import type { ApiResponse } from "@/api/types";
import type { CreatePaymentPayload, Payment, PaymentMethod } from "@/types/payment";

export interface PaymentDetail extends Payment {
  invoice_status: string;
  invoice_final_amount: number;
  total_paid: number;
  remaining: number;
}

function mapPayment(payment: PaymentDetail): PaymentDetail {
  return {
    ...payment,
    amount: Number(payment.amount),
    invoice_final_amount: Number(payment.invoice_final_amount),
    total_paid: Number(payment.total_paid),
    remaining: Number(payment.remaining),
  };
}

export const paymentApi = {
  create: async (payload: CreatePaymentPayload) => {
    const res = await axiosInstance.post<ApiResponse<PaymentDetail>>("/payment", payload);
    return mapPayment(res.data.data);
  },

  getByInvoice: async (invoiceId: string) => {
    const res = await axiosInstance.get<ApiResponse<PaymentDetail[]>>(
      `/payment/invoice/${invoiceId}`,
    );
    return res.data.data.map(mapPayment);
  },

  getById: async (id: string) => {
    const res = await axiosInstance.get<ApiResponse<PaymentDetail>>(`/payment/${id}`);
    return mapPayment(res.data.data);
  },
};

export function requiresReferenceNumber(method: PaymentMethod): boolean {
  return method === "bank_transfer" || method === "e_wallet";
}

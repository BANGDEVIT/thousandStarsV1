import axiosInstance from "@/api/axiosInstance";
import type { ApiResponse } from "@/api/types";
import type { Invoice, UpdateInvoiceDiscountPayload } from "@/types/invoice";

type RawPaymentInInvoice = {
  id: string;
  amount: number;
  paymnet_method?: string;
  payment_method?: string;
  reference_number: string | null;
  paid_at: string;
};

type RawInvoice = Omit<Invoice, "payments"> & {
  payments: RawPaymentInInvoice[];
};

function mapInvoice(invoice: RawInvoice): Invoice {
  return {
    ...invoice,
    total_amount: Number(invoice.total_amount),
    discount: Number(invoice.discount),
    final_amount: Number(invoice.final_amount),
    total_paid: Number(invoice.total_paid),
    remaining: Number(invoice.remaining),
    payments: invoice.payments.map((payment) => ({
      id: payment.id,
      amount: Number(payment.amount),
      payment_method: payment.payment_method ?? payment.paymnet_method ?? "cash",
      reference_number: payment.reference_number,
      paid_at: payment.paid_at,
    })),
  };
}

export const invoiceApi = {
  getByBooking: async (bookingId: string) => {
    const res = await axiosInstance.get<ApiResponse<RawInvoice>>(
      `/invoices/booking/${bookingId}`,
    );
    return mapInvoice(res.data.data);
  },

  getById: async (id: string) => {
    const res = await axiosInstance.get<ApiResponse<RawInvoice>>(`/invoices/${id}`);
    return mapInvoice(res.data.data);
  },

  updateDiscount: async (id: string, payload: UpdateInvoiceDiscountPayload) => {
    const res = await axiosInstance.patch<ApiResponse<RawInvoice>>(
      `/invoices/${id}/discount`,
      payload,
    );
    return mapInvoice(res.data.data);
  },
};

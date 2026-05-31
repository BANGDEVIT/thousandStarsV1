import { create } from "zustand";
import { toast } from "sonner";
import { getErrorMessage } from "@/api/types";
import { paymentApi, type PaymentDetail } from "@/features/payments/api/paymentApi";
import type { CreatePaymentPayload } from "@/types/payment";

interface PaymentState {
  items: PaymentDetail[];
  selectedPayment: PaymentDetail | null;
  loading: boolean;
  error: string | null;

  fetchByInvoice: (invoiceId: string) => Promise<void>;
  fetchById: (id: string) => Promise<void>;
  createPayment: (payload: CreatePaymentPayload, remaining?: number) => Promise<void>;
  clearError: () => void;
  clearPayments: () => void;
}

export const usePaymentStore = create<PaymentState>((set, get) => ({
  items: [],
  selectedPayment: null,
  loading: false,
  error: null,

  fetchByInvoice: async (invoiceId) => {
    try {
      set({ loading: true, error: null });
      const items = await paymentApi.getByInvoice(invoiceId);
      set({ items });
    } catch (error) {
      const message = getErrorMessage(error);
      set({ error: message });
      toast.error(message);
    } finally {
      set({ loading: false });
    }
  },

  fetchById: async (id) => {
    try {
      set({ loading: true, error: null });
      const selectedPayment = await paymentApi.getById(id);
      set({ selectedPayment });
    } catch (error) {
      const message = getErrorMessage(error);
      set({ error: message });
      toast.error(message);
    } finally {
      set({ loading: false });
    }
  },

  createPayment: async (payload, remaining) => {
    if (remaining !== undefined && payload.amount > remaining) {
      const message = "Số tiền không được vượt quá số tiền còn lại";
      set({ error: message });
      toast.error(message);
      throw new Error(message);
    }

    const toastId = toast.loading("Đang xử lý...");
    try {
      set({ loading: true, error: null });
      await paymentApi.create(payload);
      toast.dismiss(toastId);
      toast.success("Thanh toán thành công");
      await get().fetchByInvoice(payload.invoice_id);
    } catch (error) {
      toast.dismiss(toastId);
      const message = getErrorMessage(error);
      set({ error: message });
      toast.error(message);
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  clearError: () => set({ error: null }),
  clearPayments: () => set({ items: [], selectedPayment: null }),
}));

import { create } from "zustand";
import { toast } from "sonner";
import { getErrorMessage } from "@/api/types";
import { invoiceApi } from "@/features/invoices/api/invoiceApi";
import type { Invoice, UpdateInvoiceDiscountPayload } from "@/types/invoice";

interface InvoiceState {
  invoice: Invoice | null;
  loading: boolean;
  error: string | null;

  fetchByBooking: (bookingId: string) => Promise<void>;
  fetchById: (id: string) => Promise<void>;
  updateDiscount: (id: string, payload: UpdateInvoiceDiscountPayload) => Promise<void>;
  clearError: () => void;
  clearInvoice: () => void;
}

export const useInvoiceStore = create<InvoiceState>((set) => ({
  invoice: null,
  loading: false,
  error: null,

  fetchByBooking: async (bookingId) => {
    try {
      set({ loading: true, error: null });
      const invoice = await invoiceApi.getByBooking(bookingId);
      set({ invoice });
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
      const invoice = await invoiceApi.getById(id);
      set({ invoice });
    } catch (error) {
      const message = getErrorMessage(error);
      set({ error: message });
      toast.error(message);
    } finally {
      set({ loading: false });
    }
  },

  updateDiscount: async (id, payload) => {
    const toastId = toast.loading("Đang xử lý...");
    try {
      set({ loading: true, error: null });
      const invoice = await invoiceApi.updateDiscount(id, payload);
      set({ invoice });
      toast.dismiss(toastId);
      toast.success("Cập nhật giảm giá thành công");
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
  clearInvoice: () => set({ invoice: null }),
}));

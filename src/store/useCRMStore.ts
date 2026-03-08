import { create } from 'zustand';
import { internalSdk } from '../services/internalSdk';

interface CRMState {
  customers: any[];
  invoices: any[];
  appointments: any[];
  isLoading: boolean;
  error: string | null;
  fetchCustomers: () => Promise<void>;
  fetchInvoices: () => Promise<void>;
  fetchAppointments: () => Promise<void>;
  updateCustomer: (id: string, data: any) => Promise<void>;
  updateAppointmentStatus: (id: string, status: string) => Promise<void>;
  deleteAppointment: (id: string) => Promise<void>;
}

export const useCRMStore = create<CRMState>((set) => ({
  customers: [],
  invoices: [],
  appointments: [],
  isLoading: false,
  error: null,
  fetchCustomers: async () => {
    set({ isLoading: true, error: null });
    try {
        const data = await internalSdk.getCustomers();
        set({ customers: Array.isArray(data) ? data : [], isLoading: false });
    } catch (err: any) {
        set({ error: err.message, isLoading: false });
    }
  },
  fetchInvoices: async () => {
    set({ isLoading: true, error: null });
    try {
        const data = await internalSdk.getInvoices();
        set({ invoices: Array.isArray(data) ? data : [], isLoading: false });
    } catch (err: any) {
        set({ error: err.message, isLoading: false });
    }
  },
  fetchAppointments: async () => {
    set({ isLoading: true, error: null });
    try {
        const data = await internalSdk.getAppointments();
        set({ appointments: Array.isArray(data) ? data : [], isLoading: false });
    } catch (err: any) {
        set({ error: err.message, isLoading: false });
    }
  },
  updateCustomer: async (id, data) => {
    await internalSdk.updateCustomer(id, data);
    set((state) => ({
      customers: state.customers.map((c) => (c.id === id ? { ...c, ...data } : c)),
    }));
  },
  updateAppointmentStatus: async (id, status) => {
    await internalSdk.updateAppointmentStatus(id, status);
    set((state) => ({
      appointments: state.appointments.map((a) => (a.id === id ? { ...a, status } : a)),
    }));
  },
  deleteAppointment: async (id) => {
    await internalSdk.deleteAppointment(id);
    set((state) => ({
      appointments: state.appointments.filter((a) => a.id !== id),
    }));
  }
}));

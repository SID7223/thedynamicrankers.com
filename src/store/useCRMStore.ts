import { create } from 'zustand';
import { internalSdk } from '../services/internalSdk';

interface CRMState {
  customers: any[];
  invoices: any[];
  appointments: any[];
  isLoading: boolean;
  fetchCustomers: () => Promise<void>;
  fetchInvoices: () => Promise<void>;
  fetchAppointments: () => Promise<void>;
  updateCustomer: (id: string, data: any) => Promise<void>;
  updateAppointmentStatus: (id: string, status: string) => Promise<void>;
}

export const useCRMStore = create<CRMState>((set) => ({
  customers: [],
  invoices: [],
  appointments: [],
  isLoading: false,
  fetchCustomers: async () => {
    set({ isLoading: true });
    const data = await internalSdk.getCustomers();
    set({ customers: data, isLoading: false });
  },
  fetchInvoices: async () => {
    set({ isLoading: true });
    const data = await internalSdk.getInvoices();
    set({ invoices: data, isLoading: false });
  },
  fetchAppointments: async () => {
    set({ isLoading: true });
    const data = await internalSdk.getAppointments();
    set({ appointments: data, isLoading: false });
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
}));

import { create } from 'zustand';
import { internalSdk } from '../services/internalSdk';

interface AuthState {
  session: any | null;
  isLoggingIn: boolean;
  loginError: string | null;
  setSession: (session: any | null) => void;
  login: (credentials: any) => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  session: JSON.parse(sessionStorage.getItem('dr_internal_session') || 'null'),
  isLoggingIn: false,
  loginError: null,
  setSession: (session) => {
    if (session) {
      sessionStorage.setItem('dr_internal_session', JSON.stringify(session));
    } else {
      sessionStorage.removeItem('dr_internal_session');
    }
    set({ session });
  },
  login: async (credentials) => {
    set({ isLoggingIn: true, loginError: null });
    try {
      const userData = await internalSdk.login(credentials);
      sessionStorage.setItem('dr_internal_session', JSON.stringify(userData));
      set({ session: userData, isLoggingIn: false });
    } catch (err: any) {
      set({ loginError: err.message, isLoggingIn: false });
      throw err;
    }
  },
  logout: async () => {
    try {
      await internalSdk.logout();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      sessionStorage.removeItem('dr_internal_session');
      set({ session: null });
    }
  },
}));

import { fetchUser } from '@/lib/fetchUser';
import create from 'zustand';

interface AuthState {
  isAuthenticated: boolean;
  loading: boolean;
  successMessage: string | null;
  errorMessage: string | null;
  login: (username: string, password: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  loading: false,
  successMessage: null,
  errorMessage: null,

  login: async (username: string, password: string) => {
    set({ loading: true });
    try {
      // Replace this with your actual login logic
      const user = await fetchUser(username, password);
      if (user) {
        set({
          isAuthenticated: true,
          loading: false,
          successMessage: 'Login successful',
          errorMessage: null,
        });
      } else {
        set({
          loading: false,
          successMessage: null,
          errorMessage: 'Invalid username or password',
        });
      }
    } catch (error) {
      set({
        loading: false,
        successMessage: null,
        errorMessage: 'An error occurred during login',
      });
    }
  },

  logout: () => set({ isAuthenticated: false, successMessage: 'Logged out successfully' }),
}));

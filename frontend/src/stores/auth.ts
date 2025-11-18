import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, StaffProfile, AuthTokens } from '@/types';
import { authService, type LoginCredentials, type RegisterStaffData } from '@/services/auth';

interface AuthState {
  user: User | null;
  staffProfiles: StaffProfile[];
  tokens: AuthTokens | null;
  currentRestaurantId: number | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  login: (credentials: LoginCredentials) => Promise<void>;
  registerStaff: (data: RegisterStaffData) => Promise<void>;
  logout: () => Promise<void>;
  setCurrentRestaurant: (restaurantId: number) => void;
  clearError: () => void;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      staffProfiles: [],
      tokens: null,
      currentRestaurantId: null,
      isLoading: false,
      error: null,

      login: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authService.login(credentials);
          set({
            user: response.user,
            staffProfiles: response.staff_profiles,
            tokens: response.tokens,
            currentRestaurantId: response.staff_profiles[0]?.restaurant || null,
            isLoading: false,
          });
          localStorage.setItem('tokens', JSON.stringify(response.tokens));
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Login failed';
          set({ error: message, isLoading: false });
          throw error;
        }
      },

      registerStaff: async (data) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authService.registerStaff(data);
          set({
            user: response.user,
            staffProfiles: response.staff_profiles,
            tokens: response.tokens,
            currentRestaurantId: response.staff_profiles[0]?.restaurant || null,
            isLoading: false,
          });
          localStorage.setItem('tokens', JSON.stringify(response.tokens));
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Registration failed';
          set({ error: message, isLoading: false });
          throw error;
        }
      },

      logout: async () => {
        const { tokens } = get();
        try {
          if (tokens?.refresh) {
            await authService.logout(tokens.refresh);
          }
        } finally {
          set({
            user: null,
            staffProfiles: [],
            tokens: null,
            currentRestaurantId: null,
          });
          localStorage.removeItem('tokens');
        }
      },

      setCurrentRestaurant: (restaurantId) => {
        set({ currentRestaurantId: restaurantId });
      },

      clearError: () => {
        set({ error: null });
      },

      checkAuth: async () => {
        const { tokens } = get();
        if (!tokens) return;

        try {
          const user = await authService.getMe();
          set({
            user,
            staffProfiles: user.staff_profiles || [],
          });
        } catch {
          set({
            user: null,
            staffProfiles: [],
            tokens: null,
            currentRestaurantId: null,
          });
          localStorage.removeItem('tokens');
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        staffProfiles: state.staffProfiles,
        tokens: state.tokens,
        currentRestaurantId: state.currentRestaurantId,
      }),
    }
  )
);

import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  getProfileAction,
  loginAction,
  registerAction,
  updateProfileAction,
} from "../actions/authActions";
import {
  clearAccessToken,
  setAccessToken,
} from "../utils/storage";
import { useCartStore } from "./cartStore";

const hydrateToken = (state) => {
  if (state?.token) {
    setAccessToken(state.token);
  }
};

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isHydrated: false,
      loading: false,
      setHydrated: (value) => set({ isHydrated: value }),
      setSession: ({ user, token }) => {
        if (token) setAccessToken(token);
        set({ user, token: token || get().token });
      },
      login: async (payload) => {
        set({ loading: true });
        try {
          const response = await loginAction(payload);
          setAccessToken(response.token);
          set({ user: response.user, token: response.token, loading: false });
          return response;
        } catch (error) {
          set({ loading: false });
          throw error;
        }
      },
      register: async (payload) => {
        set({ loading: true });
        try {
          const response = await registerAction(payload);
          setAccessToken(response.token);
          set({ user: response.user, token: response.token, loading: false });
          return response;
        } catch (error) {
          set({ loading: false });
          throw error;
        }
      },
      fetchProfile: async () => {
        const response = await getProfileAction();
        set({ user: response.user });
        return response.user;
      },
      updateProfile: async (payload) => {
        const response = await updateProfileAction(payload);
        set({ user: response.user });
        return response;
      },
      logout: () => {
        clearAccessToken();
        useCartStore.getState().clearCart();
        set({ user: null, token: null });
      },
      isAdmin: () => get().user?.role === "admin",
    }),
    {
      name: "libaas-auth",
      partialize: (state) => ({
        user: state.user,
        token: state.token,
      }),
      onRehydrateStorage: () => (state) => {
        hydrateToken(state);
        state?.setHydrated(true);
      },
    }
  )
);

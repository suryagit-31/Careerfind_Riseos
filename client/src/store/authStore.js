import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";
import { toast } from "react-hot-toast";
import { is } from "date-fns/locale";

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: true,
      authUser: null,
      is_signingup: false,
      is_loggingin: false,
      is_userlogged: false,
      is_updatingprofile: false,
      ischeckingAuth: true,

      login: async (email, password) => {
        set({ is_loggingin: true });
        console.log(email, password);
        try {
          const response = await axios.post("/api/auth/login", {
            email,
            password,
          });
          console.log(response);
          const { user, token } = response.data;
          set({ user, token });
          toast.success(response.data.message);
          axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        } catch (error) {
          throw error;
        } finally {
          set({ is_loggingin: false });
        }
      },

      register: async (name, email, password) => {
        try {
          set({ is_signingup: true });
          const response = await axios.post("/api/auth/register", {
            name,
            email,
            password,
          });
          const { user, token } = response.data;
          set({ user, token, is_signingup: false, is_userlogged: true });
          axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        } catch (error) {
          toast.error(error.response?.data?.message || error.message);
          set({ is_signingup: false, authUser: null, is_userlogged: false });
        } finally {
          set({ is_signingup: false });
        }
      },

      logout: async () => {
        try {
          const response = await axios.post("/api/auth/logout");
          console.log(response);
          set({ user: null, token: null });
          delete axios.defaults.headers.common["Authorization"];
          toast.success(response.data.message);
        } catch (error) {
          console.log(
            "error in logout ",
            error.response?.data?.message || error.message
          );
          toast.error(error.response?.data?.message || error.message);
        }
      },

      initialize: () => {
        const { token } = get();
        if (token) {
          axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        }
        set({ isLoading: false });
      },
    }),
    {
      name: "auth-storage",
      onRehydrateStorage: () => (state) => {
        if (state) state.initialize();
      },
    }
  )
);

import { create } from "zustand";
import { supabase } from "./supabase";
import { ensureTablesExist } from "./db";

type AuthStore = {
  user: any;
  session: any;
  loading: boolean;
  initialize: () => Promise<void>;
  signOut: () => Promise<void>;
};

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  session: null,
  loading: true,
  initialize: async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        // Ensure all required tables and user data exist
        await ensureTablesExist();
      }

      set({ session, user: session?.user ?? null, loading: false });

      // Set up auth state change listener
      supabase.auth.onAuthStateChange(async (_event, session) => {
        set({ session, user: session?.user ?? null });

        // When user signs in, ensure tables exist and redirect to dashboard
        if (session?.user) {
          await ensureTablesExist();
          // Redirect to dashboard if on auth page
          if (window.location.pathname === "/auth") {
            window.location.href = "/dashboard";
          }
        }
      });
    } catch (error) {
      console.error("Error initializing auth:", error);
      set({ loading: false });
    }
  },
  signOut: async () => {
    await supabase.auth.signOut();
    set({ user: null, session: null });
    window.location.href = "/";
  },
}));

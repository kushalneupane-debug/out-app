import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface OutSession {
  phone: string;
  name: string;
  vibe: string;
  lat?: number;
  lng?: number;
}

interface StoreState {
  session: OutSession | null;
  setSession: (s: OutSession | null) => void;
  patchSession: (patch: Partial<OutSession>) => void;
  clearSession: () => void;
}

export const useOutStore = create<StoreState>()(
  persist(
    (set) => ({
      session: null,
      setSession: (session) => set({ session }),
      patchSession: (patch) =>
        set((state) => ({
          session: state.session ? { ...state.session, ...patch } : null,
        })),
      clearSession: () => set({ session: null }),
    }),
    { name: "out-session" }
  )
);

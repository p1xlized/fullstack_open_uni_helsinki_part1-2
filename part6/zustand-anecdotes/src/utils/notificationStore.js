import { create } from "zustand";

const useNotificationStore = create((set, get) => ({
  message: null,
  timeoutId: null,
  actions: {
    showNotification: (message, seconds = 5) => {
      // Clear any pending active timeouts to prevent premature fading
      const currentTimeoutId = get().timeoutId;
      if (currentTimeoutId) clearTimeout(currentTimeoutId);

      const timeoutId = setTimeout(() => {
        set({ message: null, timeoutId: null });
      }, seconds * 1000);

      set({ message, timeoutId });
    },
    clearNotification: () => {
      const currentTimeoutId = get().timeoutId;
      if (currentTimeoutId) clearTimeout(currentTimeoutId);
      set({ message: null, timeoutId: null });
    },
  },
}));

export const useNotificationMessage = () =>
  useNotificationStore((state) => state.message);
export const useNotificationActions = () =>
  useNotificationStore((state) => state.actions);

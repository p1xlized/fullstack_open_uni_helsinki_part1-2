import { create } from "zustand";

const useAnecdoteStore = create((set) => ({
  anecdotes: [],
  filter: "",
  actions: {
    setAnecdotes: (anecdotes) => set({ anecdotes }),

    // 6.8: Save new item natively into backend state
    addAnecdote: (newAnecdote) =>
      set((state) => ({
        anecdotes: state.anecdotes.concat(newAnecdote),
      })),

    // 6.9: Sync state slice changes down after database resolution updates
    updateAnecdote: (updatedAnecdote) =>
      set((state) => ({
        anecdotes: state.anecdotes.map((a) =>
          a.id === updatedAnecdote.id ? updatedAnecdote : a,
        ),
      })),

    // 6.11: Delete items with 0 votes completely from state and server
    removeAnecdote: (id) =>
      set((state) => ({
        anecdotes: state.anecdotes.filter((a) => a.id !== id),
      })),

    setFilter: (filterValue) => set({ filter: filterValue }),
  },
}));

export const useAnecdotes = () => useAnecdoteStore((state) => state.anecdotes);
export const useFilter = () => useAnecdoteStore((state) => state.filter);
export const useAnecdoteActions = () =>
  useAnecdoteStore((state) => state.actions);
export default useAnecdoteStore;

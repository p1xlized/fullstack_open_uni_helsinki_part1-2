import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAnecdotes, createAnecdote, updateAnecdote } from "../requests";
import { useNotify } from "../utils/NotificationContext";

export const useAnecdotes = () => {
  const queryClient = useQueryClient();
  const notify = useNotify();

  const anecdotesQuery = useQuery({
    queryKey: ["anecdotes"],
    queryFn: getAnecdotes,
    retry: 1,
  });

  const createAnecdoteMutation = useMutation({
    mutationFn: createAnecdote,
    onSuccess: (newAnecdote) => {
      queryClient.invalidateQueries({ queryKey: ["anecdotes"] });
      notify(`anecdote '${newAnecdote.content}' created`);
    },
    onError: (error) => {
      // Handles 5-character server validation rejections gracefully
      notify("too short anecdote, must have length 5 or more");
    },
  });

  const voteAnecdoteMutation = useMutation({
    mutationFn: updateAnecdote,
    onSuccess: (updatedAnecdote) => {
      queryClient.invalidateQueries({ queryKey: ["anecdotes"] });
      notify(`anecdote '${updatedAnecdote.content}' voted`);
    },
  });

  return {
    anecdotes: anecdotesQuery.data ?? [],
    isLoading: anecdotesQuery.isPending,
    isError: anecdotesQuery.isError,
    addAnecdote: (content) =>
      createAnecdoteMutation.mutate({ content, votes: 0 }),
    voteAnecdote: (anecdote) =>
      voteAnecdoteMutation.mutate({ ...anecdote, votes: anecdote.votes + 1 }),
  };
};

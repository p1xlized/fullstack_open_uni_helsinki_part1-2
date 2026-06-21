import anecdoteService from "../services/anecdotes";
import { useAnecdotes, useFilter, useAnecdoteActions } from "../store";
import { useNotificationActions } from "../utils/notificationStore";

const AnecdoteList = () => {
  const anecdotes = useAnecdotes();
  const filter = useFilter();
  const { updateAnecdote, removeAnecdote } = useAnecdoteActions();
  const { showNotification } = useNotificationActions();

  const handleVote = async (anecdote) => {
    const changedAnecdote = { ...anecdote, votes: anecdote.votes + 1 };
    const updated = await anecdoteService.update(anecdote.id, changedAnecdote);
    updateAnecdote(updated);
    showNotification(`You voted for "${anecdote.content}"`);
  };

  const handleDelete = async (anecdote) => {
    if (anecdote.votes === 0) {
      await anecdoteService.remove(anecdote.id);
      removeAnecdote(anecdote.id);
      showNotification(`Deleted text block: "${anecdote.content}"`);
    }
  };

  const filteredAnecdotes = anecdotes.filter((a) =>
    a.content.toLowerCase().includes(filter.toLowerCase()),
  );

  const sortedAnecdotes = filteredAnecdotes.toSorted(
    (a, b) => b.votes - a.votes,
  );

  return (
    <div>
      {sortedAnecdotes.map((anecdote) => (
        <div
          key={anecdote.id}
          style={{
            marginBottom: "12px",
            padding: "5px",
            borderBottom: "1px dashed #ccc",
          }}
        >
          <div>{anecdote.content}</div>
          <div style={{ marginTop: "4px" }}>
            has {anecdote.votes} votes{" "}
            <button
              onClick={() => handleVote(anecdote.id ? anecdote : anecdote)}
            >
              vote
            </button>
            {anecdote.votes === 0 && (
              <button
                onClick={() => handleDelete(anecdote)}
                style={{ marginLeft: "10px", color: "red" }}
              >
                delete
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default AnecdoteList;

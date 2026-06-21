import { useAnecdotes } from "./hooks/useAnecdotes";
import AnecdoteForm from "./components/AnecdoteForm";
import Notification from "./components/Notification";

const App = () => {
  const { anecdotes, isLoading, isError, voteAnecdote } = useAnecdotes();

  if (isLoading) {
    return <div>loading data...</div>;
  }

  if (isError) {
    return <div>anecdote service not available due to problems in server</div>;
  }

  const sortedAnecdotes = [...anecdotes].sort((a, b) => b.votes - a.votes);

  return (
    <div>
      <h3>Anecdote app</h3>

      <Notification />
      <AnecdoteForm />

      {sortedAnecdotes.map((anecdote) => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => voteAnecdote(anecdote)}>vote</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default App;

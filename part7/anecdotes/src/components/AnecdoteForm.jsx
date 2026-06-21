import { useAnecdotes } from "../hooks/useAnecdotes";

const AnecdoteForm = () => {
  const { addAnecdote } = useAnecdotes();

  const onCreate = (event) => {
    event.preventDefault();
    const content = event.target.anecdote.value;

    if (content.trim()) {
      addAnecdote(content);
      event.target.anecdote.value = "";
    }
  };

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={onCreate}>
        <div>
          <input name="anecdote" />
        </div>
        <button type="submit">create</button>
      </form>
    </div>
  );
};

export default AnecdoteForm;

// @vitest-environment jsdom
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, test, expect, beforeEach, vi } from "vitest";
import * as matchers from "@testing-library/jest-dom/matchers";
import useAnecdoteStore from "../../store";
import AnecdoteList from "../AnecdoteList";
import Filter from "../Filter";

expect.extend(matchers);

const mockBackendAnecdotes = [
  { content: "An unvoted quote", id: "1", votes: 0 },
  { content: "The most popular quote", id: "2", votes: 12 },
  { content: "A moderately funny quote", id: "3", votes: 4 },
];

describe("Anecdotes State and Component Architecture", () => {
  beforeEach(() => {
    cleanup();
    const { setAnecdotes, setFilter } = useAnecdoteStore.getState().actions;
    setAnecdotes([]);
    setFilter("");
    vi.restoreAllMocks();
  });

  test("verifies state is initialized with the anecdotes returned by the backend", () => {
    const { setAnecdotes } = useAnecdoteStore.getState().actions;
    setAnecdotes(mockBackendAnecdotes);

    const currentStoreState = useAnecdoteStore.getState().anecdotes;
    expect(currentStoreState).toHaveLength(3);
    expect(currentStoreState[0].content).toBe("An unvoted quote");
    expect(currentStoreState[1].votes).toBe(12);
  });

  test("verifies the component displaying anecdotes receives them sorted by votes", () => {
    const { setAnecdotes } = useAnecdoteStore.getState().actions;
    setAnecdotes(mockBackendAnecdotes);

    render(<AnecdoteList />);

    const items = screen.getAllByText(/votes/);

    expect(items[0].parentElement.textContent).toContain(
      "The most popular quote",
    );
    expect(items[0].parentElement.textContent).toContain("has 12 votes");

    expect(items[1].parentElement.textContent).toContain(
      "A moderately funny quote",
    );
    expect(items[1].parentElement.textContent).toContain("has 4 votes");

    expect(items[2].parentElement.textContent).toContain("An unvoted quote");
    expect(items[2].parentElement.textContent).toContain("has 0 votes");
  });

  test("verifies the correct React component receives a properly filtered list", async () => {
    const { setAnecdotes } = useAnecdoteStore.getState().actions;
    setAnecdotes(mockBackendAnecdotes);

    render(
      <div>
        <Filter />
        <AnecdoteList />
      </div>,
    );

    expect(screen.getByText("The most popular quote")).toBeInTheDocument();
    expect(screen.getByText("A moderately funny quote")).toBeInTheDocument();

    const user = userEvent.setup();
    const filterInput = screen.getByRole("textbox");
    await user.type(filterInput, "funny");

    expect(screen.getByText("A moderately funny quote")).toBeInTheDocument();
    expect(
      screen.queryByText("The most popular quote"),
    ).not.toBeInTheDocument();
    expect(screen.queryByText("An unvoted quote")).not.toBeInTheDocument();
  });

  test("verifies that voting increases the number of votes for an anecdote", async () => {
    const spyFetch = vi.spyOn(globalThis, "fetch").mockImplementation(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve({
            content: "An unvoted quote",
            id: "1",
            votes: 1,
          }),
      }),
    );

    const { setAnecdotes } = useAnecdoteStore.getState().actions;
    setAnecdotes([mockBackendAnecdotes[0]]);

    render(<AnecdoteList />);

    const initialLabels = screen.getAllByText(/has 0 votes/);
    expect(initialLabels[0]).toBeInTheDocument();

    const user = userEvent.setup();
    const voteButton = screen.getByRole("button", { name: "vote" });
    await user.click(voteButton);

    expect(spyFetch).toHaveBeenCalled();

    const updatedLabel = await screen.findByText(/has 1 votes/);
    expect(updatedLabel).toBeInTheDocument();
  });
});

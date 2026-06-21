// @vitest-environment jsdom
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, test, expect, vi } from "vitest";
import Blog from "../Blog";

describe("<Blog /> (Routed Requirements)", () => {
  const blog = {
    id: "123",
    title: "Testing Routed Components",
    author: "Router Architect",
    url: "https://reactrouter.com",
    likes: 10,
    user: { username: "creatorUser", name: "Original Creator", id: "ownerId" },
  };

  test("displays info and likes to unauthenticated users, but hides interaction buttons", () => {
    const { container } = render(<Blog blog={blog} currentUser={null} />);

    expect(container.textContent).toContain("Testing Routed Components");
    expect(container.textContent).toContain("https://reactrouter.com");
    expect(container.textContent).toContain("Likes: 10");

    const buttons = container.querySelectorAll("button");
    expect(buttons.length).toBe(0);
  });

  test("displays only the like button to authenticated non-creators", () => {
    const nonCreator = {
      username: "intruder",
      name: "Viewer User",
      id: "viewerId",
    };
    const { container } = render(<Blog blog={blog} currentUser={nonCreator} />);

    const buttons = container.querySelectorAll("button");
    expect(buttons.length).toBe(1);
    expect(buttons[0].textContent).toBe("like");
  });

  test("displays both like and delete buttons to the blog creator", () => {
    const creator = {
      username: "creatorUser",
      name: "Original Creator",
      id: "ownerId",
    };
    const { container } = render(<Blog blog={blog} currentUser={creator} />);

    const buttons = container.querySelectorAll("button");
    expect(buttons.length).toBe(2);

    const textContents = Array.from(buttons).map((b) => b.textContent);
    expect(textContents).toContain("like");
    expect(textContents).toContain("remove");
  });
});

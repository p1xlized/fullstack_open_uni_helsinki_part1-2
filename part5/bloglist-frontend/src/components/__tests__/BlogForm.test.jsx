import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, test, expect, vi } from "vitest";
import BlogForm from "../BlogForm";

// Test suite for the BlogForm component
describe("<BlogForm />", () => {
  // Test: Form submission should call the handler with correct blog details
  test("calls the event handler with the right details when a new blog is created", async () => {
    // Create a mock function to track what data is passed to it
    const createBlogMock = vi.fn();
    // Setup user interaction helper
    const user = userEvent.setup();

    render(<BlogForm createBlog={createBlogMock} />);

    // Get all text input fields from the form
    const inputs = screen.getAllByRole("textbox");
    // Assign inputs to variables for clarity (title, author, url)
    const titleInput = inputs[0];
    const authorInput = inputs[1];
    const urlInput = inputs[2];

    // Get the submit button
    const submitButton = screen.getByText("create");

    // Fill in the form fields with test data
    await user.type(titleInput, "Continuous Integration Patterns");
    await user.type(authorInput, "Martin Fowler");
    await user.type(urlInput, "https://martinfowler.com/ci");

    // Submit the form
    await user.click(submitButton);

    // Verify the mock was called exactly once
    expect(createBlogMock.mock.calls).toHaveLength(1);

    // Verify the mock was called with the correct blog data
    expect(createBlogMock.mock.calls[0][0]).toEqual({
      title: "Continuous Integration Patterns",
      author: "Martin Fowler",
      url: "https://martinfowler.com/ci",
    });
  });
});

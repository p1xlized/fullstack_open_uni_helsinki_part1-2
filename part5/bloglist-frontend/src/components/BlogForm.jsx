import { useState } from "react";
import { FormContainer, FormGroup, Button } from "./StyledComponents";

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [url, setUrl] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    createBlog({ title, author, url });
    setTitle("");
    setAuthor("");
    setUrl("");
  };

  return (
    <FormContainer>
      <h3>Create a New Blog</h3>
      <form onSubmit={handleSubmit}>
        <FormGroup>
          <label>Title</label>
          <input
            value={title}
            onChange={({ target }) => setTitle(target.value)}
            placeholder="Blog title"
          />
        </FormGroup>
        <FormGroup>
          <label>Author</label>
          <input
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
            placeholder="Author name"
          />
        </FormGroup>
        <FormGroup>
          <label>URL</label>
          <input
            value={url}
            onChange={({ target }) => setUrl(target.value)}
            placeholder="Link URL"
          />
        </FormGroup>
        <Button type="submit">Create Entry</Button>
      </form>
    </FormContainer>
  );
};

export default BlogForm;

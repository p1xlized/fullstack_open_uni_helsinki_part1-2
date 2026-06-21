import { BlogDetailWrapper, Button } from "./StyledComponents";

const Blog = ({ blog, updateLikes, removeBlog, currentUser }) => {
  if (!blog) return <p>Blog post not found.</p>;

  const handleLike = () => {
    if (!currentUser) return;
    updateLikes(blog.id, {
      ...blog,
      likes: blog.likes + 1,
      user: blog.user?.id || blog.user,
    });
  };

  const isCreator =
    blog.user &&
    currentUser &&
    (blog.user.username === currentUser.username ||
      blog.user === currentUser.id);

  return (
    <BlogDetailWrapper className="blog-details">
      <h2>{blog.title}</h2>
      <p>
        <strong>Author:</strong> {blog.author}
      </p>
      <p>
        <strong>URL:</strong>{" "}
        <a href={blog.url} target="_blank" rel="noreferrer">
          {blog.url}
        </a>
      </p>
      <p>
        <strong>Likes:</strong>{" "}
        <span className="likes-count">{blog.likes}</span>{" "}
        {currentUser && (
          <Button
            secondary
            onClick={handleLike}
            style={{ marginLeft: 10, padding: "4px 10px", fontSize: "0.85rem" }}
          >
            like
          </Button>
        )}
      </p>
      <p>
        <small>Added by: {blog.user?.name || "System"}</small>
      </p>

      {currentUser && isCreator && (
        <Button
          danger
          style={{ marginTop: 15 }}
          onClick={() =>
            window.confirm(`Remove ${blog.title}?`) && removeBlog(blog.id)
          }
        >
          Delete Blog
        </Button>
      )}
    </BlogDetailWrapper>
  );
};

export default Blog;

import { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useParams,
} from "react-router-dom";
import useStore from "./utils/store";
import ErrorBoundary from "./components/ErrorBoundry";
import userService from "./services/users";
import loginService from "./services/login";

const Menu = ({ user, handleLogout }) => {
  const padding = { paddingRight: 15 };
  return (
    <nav style={{ background: "#eee", padding: 10, marginBottom: 15 }}>
      <Link style={padding} to="/">
        blogs
      </Link>
      <Link style={padding} to="/users">
        users
      </Link>
      <span style={{ marginLeft: "10px" }}>
        <strong>{user.name}</strong> logged in{" "}
        <button onClick={handleLogout}>logout</button>
      </span>
    </nav>
  );
};

const UsersList = ({ users }) => (
  <div>
    <h2>Users</h2>
    <table>
      <thead>
        <tr>
          <th>User Name</th>
          <th>Blogs Created</th>
        </tr>
      </thead>
      <tbody>
        {users.map((u) => (
          <tr key={u.id}>
            <td>
              <Link to={`/users/${u.id}`}>{u.name}</Link>
            </td>
            <td>{u.blogs ? u.blogs.length : 0}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const UserView = ({ users }) => {
  const { id } = useParams();
  const user = users.find((u) => u.id === id);
  if (!user) return <p>User profiling data not resolved.</p>;

  return (
    <div>
      <h2>{user.name}</h2>
      <h3>Added Blogs</h3>
      <ul>
        {user.blogs && user.blogs.map((b) => <li key={b.id}>{b.title}</li>)}
      </ul>
    </div>
  );
};

const BlogDetail = () => {
  const { id } = useParams();
  const [comment, setComment] = useState("");
  const { blogs, likeBlog, addComment } = useStore();

  const blog = blogs.find((b) => b.id === id);
  if (!blog) return <p>Blog matching target resource signature not found.</p>;

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    addComment(blog.id, comment.trim());
    setComment("");
  };

  return (
    <div>
      <h2>
        {blog.title} by {blog.author}
      </h2>
      <div>
        <a href={blog.url} target="_blank" rel="noreferrer">
          {blog.url}
        </a>
      </div>
      <div style={{ margin: "5px 0" }}>
        {blog.likes} likes{" "}
        <button onClick={() => likeBlog(blog.id, blog)}>like</button>
      </div>
      <div>Added by {blog.user ? blog.user.name : "anonymous"}</div>

      <h3>Comments</h3>
      <form onSubmit={handleCommentSubmit}>
        <input
          value={comment}
          onChange={({ target }) => setComment(target.value)}
        />
        <button type="submit">add comment</button>
      </form>
      <ul style={{ marginTop: "10px" }}>
        {blog.comments && blog.comments.map((c, idx) => <li key={idx}>{c}</li>)}
      </ul>
    </div>
  );
};

const App = () => {
  const {
    user,
    blogs,
    notification,
    initializeBlogs,
    setUser,
    setNotification,
  } = useStore();
  const [users, setUsers] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (user) {
      initializeBlogs();
      userService
        .getAll()
        .then((res) => setUsers(res))
        .catch((err) => console.error(err));
    }
  }, [user, initializeBlogs]);

  const handleLoginSubmit = async (event) => {
    event.preventDefault();
    try {
      const loggedUser = await loginService.login({ username, password });
      setUser(loggedUser);
      setUsername("");
      setPassword("");
      setNotification("Welcome back!", "success");
    } catch (exception) {
      setNotification("Wrong username or password", "error");
    }
  };

  if (!user) {
    return (
      <div style={{ padding: 20, maxWidth: 400, margin: "0 auto" }}>
        <h2>Log in to application</h2>

        {notification && (
          <div
            style={{
              padding: 10,
              margin: "10px 0",
              border: "1px solid red",
              color: "red",
              background: "#fce8e6",
            }}
          >
            {notification.message}
          </div>
        )}

        <form onSubmit={handleLoginSubmit}>
          <div style={{ marginBottom: 10 }}>
            <label style={{ display: "block", marginBottom: 5 }}>
              Username:
            </label>
            <input
              type="text"
              value={username}
              name="Username"
              onChange={({ target }) => setUsername(target.value)}
              style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
            />
          </div>
          <div style={{ marginBottom: 15 }}>
            <label style={{ display: "block", marginBottom: 5 }}>
              Password:
            </label>
            <input
              type="password"
              value={password}
              name="Password"
              onChange={({ target }) => setPassword(target.value)}
              style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
            />
          </div>
          <button
            type="submit"
            style={{
              width: "100%",
              padding: "10px",
              background: "#007bff",
              color: "white",
              border: "none",
              cursor: "pointer",
            }}
          >
            Login
          </button>
        </form>
      </div>
    );
  }

  return (
    <Router>
      <div style={{ padding: "0px 20px" }}>
        <Menu user={user} handleLogout={() => setUser(null)} />

        {notification && (
          <div
            style={{
              padding: 10,
              margin: "10px 0",
              border: "1px solid green",
              background: "#e2f0d9",
            }}
          >
            {notification.message}
          </div>
        )}

        <ErrorBoundary>
          <Routes>
            <Route
              path="/"
              element={
                <div>
                  <h2>Blogs</h2>
                  {blogs.map((b) => (
                    <div
                      key={b.id}
                      style={{
                        padding: "5px 0",
                        borderBottom: "1px solid #eee",
                      }}
                    >
                      <Link to={`/blogs/${b.id}`}>
                        {b.title} — {b.author}
                      </Link>
                    </div>
                  ))}
                </div>
              }
            />
            <Route path="/blogs/:id" element={<BlogDetail />} />
            <Route path="/users" element={<UsersList users={users} />} />
            <Route path="/users/:id" element={<UserView users={users} />} />
            <Route
              path="*"
              element={
                <div style={{ textAlign: "center", padding: 40 }}>
                  <h2>Page Not Found</h2>
                  <p>The requested route does not exist.</p>
                </div>
              }
            />
          </Routes>
        </ErrorBoundary>
      </div>
    </Router>
  );
};

export default App;

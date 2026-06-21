// src/App.jsx
import { useState, useEffect } from "react";
import { Routes, Route, Link, useNavigate, useMatch } from "react-router-dom";
import blogService from "./services/blogs";
import loginService from "./services/login";
import Blog from "./components/Blog";
import BlogForm from "./components/BlogForm";
import {
  GlobalStyle,
  AppContainer,
  Nav,
  FormContainer,
  FormGroup,
  Button,
  StyledNotification,
  BlogItemCard,
} from "./components/StyledComponents";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [notification, setNotification] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    blogService.getAll().then((initialBlogs) => setBlogs(initialBlogs));
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogappUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const user = await loginService.login({ username, password });
      window.localStorage.setItem("loggedBlogappUser", JSON.stringify(user));
      blogService.setToken(user.token);
      setUser(user);
      setUsername("");
      setPassword("");
      setNotification({
        message: `Welcome back, ${user.name}!`,
        type: "success",
      });
      setTimeout(() => setNotification(null), 5000);
      navigate("/");
    } catch (exception) {
      setNotification({ message: "Wrong username or password", type: "error" });
      setTimeout(() => setNotification(null), 5000);
    }
  };

  const handleLogout = () => {
    window.localStorage.removeItem("loggedBlogappUser");
    setUser(null);
    blogService.setToken(null);
    setNotification({ message: "Logged out successfully", type: "success" });
    setTimeout(() => setNotification(null), 5000);
    navigate("/");
  };

  const createBlog = async (blogObject) => {
    try {
      const createdBlog = await blogService.create(blogObject);
      // Hydrate local state manually with the current user structure if necessary
      const completeBlog = {
        ...createdBlog,
        user: {
          username: user.username,
          name: user.name,
          id: createdBlog.user,
        },
      };
      setBlogs(blogs.concat(completeBlog));
      setNotification({
        message: `A new blog "${blogObject.title}" added`,
        type: "success",
      });
      setTimeout(() => setNotification(null), 5000);
      navigate("/");
    } catch (error) {
      setNotification({
        message: "Failed to create blog entry",
        type: "error",
      });
      setTimeout(() => setNotification(null), 5000);
    }
  };

  const updateLikes = async (id, updatedBlog) => {
    const response = await blogService.update(id, updatedBlog);
    setBlogs(
      blogs.map((b) => (b.id === id ? { ...b, likes: response.likes } : b)),
    );
  };

  const removeBlog = async (id) => {
    try {
      await blogService.remove(id);
      setBlogs(blogs.filter((b) => b.id !== id));
      navigate("/");
    } catch (error) {
      setNotification({
        message: "Unauthorized removal attempt",
        type: "error",
      });
      setTimeout(() => setNotification(null), 5000);
    }
  };

  // Parameterized Route Matcher for Single Blog Page View
  const match = useMatch("/blogs/:id");
  const matchedBlog = match
    ? blogs.find((b) => b.id === match.params.id)
    : null;

  return (
    <AppContainer>
      <GlobalStyle />
      <Nav>
        <Link to="/">Blogs</Link>
        {user ? (
          <>
            <Link to="/create">Create New</Link>
            <span>{user.name} logged in</span>
            <Button
              secondary
              onClick={handleLogout}
              style={{ padding: "6px 12px", fontSize: "0.85rem" }}
            >
              Logout
            </Button>
          </>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </Nav>

      {notification && (
        <StyledNotification type={notification.type}>
          {notification.message}
        </StyledNotification>
      )}

      <Routes>
        <Route
          path="/"
          element={
            <div>
              <h2>Trending Posts</h2>
              {[...blogs]
                .sort((a, b) => b.likes - a.likes)
                .map((blog) => (
                  <BlogItemCard key={blog.id}>
                    <Link to={`/blogs/${blog.id}`}>
                      {blog.title} — <em>{blog.author}</em>
                    </Link>
                  </BlogItemCard>
                ))}
            </div>
          }
        />

        <Route
          path="/login"
          element={
            <FormContainer>
              <h3>Log In to Application</h3>
              <form onSubmit={handleLogin}>
                <FormGroup>
                  <label>Username</label>
                  <input
                    name="Username"
                    value={username}
                    onChange={({ target }) => setUsername(target.value)}
                  />
                </FormGroup>
                <FormGroup>
                  <label>Password</label>
                  <input
                    type="password"
                    name="Password"
                    value={password}
                    onChange={({ target }) => setPassword(target.value)}
                  />
                </FormGroup>
                <Button type="submit">Sign In</Button>
              </form>
            </FormContainer>
          }
        />

        <Route
          path="/create"
          element={
            user ? <BlogForm createBlog={createBlog} /> : <p>Please log in.</p>
          }
        />
        <Route
          path="/blogs/:id"
          element={
            <Blog
              blog={matchedBlog}
              updateLikes={updateLikes}
              removeBlog={removeBlog}
              currentUser={user}
            />
          }
        />
      </Routes>
    </AppContainer>
  );
};

export default App;

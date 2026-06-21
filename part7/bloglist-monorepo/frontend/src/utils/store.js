import { create } from "zustand";
import blogService from "../services/blogs";
import persistentUser from "../services/persistentUser";

const useStore = create((set, get) => ({
  notification: null,
  blogs: [],
  user: persistentUser.getUser(),

  setNotification: (message, type = "success", seconds = 5) => {
    set({ notification: { message, type } });
    setTimeout(() => {
      set({ notification: null });
    }, seconds * 1000);
  },

  initializeBlogs: async () => {
    const blogs = await blogService.getAll();
    set({ blogs: blogs.sort((a, b) => b.likes - a.likes) });
  },

  createBlog: async (blogObject) => {
    try {
      const newBlog = await blogService.create(blogObject);
      set((state) => ({ blogs: state.blogs.concat(newBlog) }));
      get().setNotification(
        `A new blog "${blogObject.title}" by ${blogObject.author} added`,
      );
    } catch (err) {
      get().setNotification("Failed to create blog", "error");
    }
  },

  likeBlog: async (id, blogObject) => {
    const updated = await blogService.update(id, {
      ...blogObject,
      likes: blogObject.likes + 1,
    });
    set((state) => ({
      blogs: state.blogs
        .map((b) => (b.id === id ? { ...b, likes: updated.likes } : b))
        .sort((a, b) => b.likes - a.likes),
    }));
  },

  deleteBlog: async (id) => {
    await blogService.remove(id);
    set((state) => ({ blogs: state.blogs.filter((b) => b.id !== id) }));
  },

  addComment: async (blogId, commentText) => {
    const updatedBlog = await blogService.addComment(blogId, commentText);
    set((state) => ({
      blogs: state.blogs.map((b) => (b.id === blogId ? updatedBlog : b)),
    }));
  },

  setUser: (user) => {
    if (user) {
      persistentUser.saveUser(user);
      if (user.token) blogService.setToken(user.token);
    } else {
      persistentUser.removeUser();
      blogService.setToken(null);
    }
    set({ user });
  },
}));

export default useStore;

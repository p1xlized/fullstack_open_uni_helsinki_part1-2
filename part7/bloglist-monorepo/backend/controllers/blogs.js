import express from "express";
import Blog from "../models/blog.js";
import middleware from "../utils/middleware.js";

const blogsRouter = express.Router();

// Fetching all blogs, no need for token
blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", { username: 1, name: 1 });
  response.json(blogs);
});

// POST blocks require a verified token mapped via middleware
blogsRouter.post(
  "/",
  middleware.userExtractor,
  async (request, response, next) => {
    const body = request.body;
    const user = request.user; // Set up natively via userExtractor

    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes,
      user: user.id,
    });

    try {
      const savedBlog = await blog.save();

      // Save reference back inside the User record array
      user.blogs = user.blogs.concat(savedBlog._id);
      await user.save();

      response.status(201).json(savedBlog);
    } catch (error) {
      next(error);
    }
  },
);

// DELETE blocks verifies ownership before deletion
blogsRouter.delete(
  "/:id",
  middleware.userExtractor,
  async (request, response, next) => {
    const user = request.user;

    try {
      const blog = await Blog.findById(request.params.id);
      if (!blog) {
        return response.status(404).json({ error: "blog not found" });
      }

      // Protect deletion bounds tracking schema identity values
      if (blog.user.toString() !== user.id.toString()) {
        return response
          .status(403)
          .json({ error: "only the creator can delete this blog" });
      }

      await Blog.findByIdAndDelete(request.params.id);
      response.status(204).end();
    } catch (error) {
      next(error);
    }
  },
);

// update
blogsRouter.put("/:id", async (request, response, next) => {
  try {
    const updated = await Blog.findByIdAndUpdate(
      request.params.id,
      request.body,
      { new: true, runValidators: true },
    );
    response.json(updated);
  } catch (error) {
    next(error);
  }
});

export default blogsRouter;

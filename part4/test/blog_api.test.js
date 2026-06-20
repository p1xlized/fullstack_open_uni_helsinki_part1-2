import { test, describe, beforeEach, after } from "node:test";
import assert from "node:assert";
import supertest from "supertest";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import app from "../app.js";
import Blog from "../models/blog.js";
import User from "../models/user.js";

const api = supertest(app);
let tokenHeader;
let savedUserId;

beforeEach(async () => {
  await Blog.deleteMany({});
  await User.deleteMany({});

  const passwordHash = await bcrypt.hash("testpassword", 10);
  const user = new User({ username: "root", name: "Superuser", passwordHash });
  const savedUser = await user.save();
  savedUserId = savedUser._id;

  const loginResponse = await api
    .post("/api/login")
    .send({ username: "root", password: "testpassword" });

  tokenHeader = `Bearer ${loginResponse.body.token}`;

  // initial blogs linked to the test user
  const initialBlogs = [
    {
      title: "React patterns",
      author: "Michael Chan",
      url: "https://react.com",
      user: savedUserId,
      likes: 7,
    },
    {
      title: "Go To Statement Considered Harmful",
      author: "Edsger W. Dijkstra",
      url: "https://edsger.com",
      user: savedUserId,
      likes: 5,
    },
  ];
  await Blog.insertMany(initialBlogs);
});

describe("when there is initially some blogs saved", () => {
  test("blogs are returned as json and correct amount is loaded", async () => {
    const response = await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/);

    assert.strictEqual(response.body.length, 2);
  });

  test("unique identifier property of blogs is named id", async () => {
    const response = await api.get("/api/blogs");
    const firstBlog = response.body[0];

    assert.ok(firstBlog.id);
    assert.strictEqual(firstBlog._id, undefined);
  });
});

describe("addition of blogs with security metrics", () => {
  test("a valid blog can be added when token is present", async () => {
    const validBlog = {
      title: "Auth works!",
      author: "Tester",
      url: "https://test.com",
      likes: 3,
    };

    await api
      .post("/api/blogs")
      .set("Authorization", tokenHeader) // Added token to fix old 4.10 test
      .send(validBlog)
      .expect(201);

    const blogsAfter = await Blog.find({});
    assert.strictEqual(blogsAfter.length, 3);
  });

  test("if likes property is missing, it defaults to 0", async () => {
    const newBlogWithoutLikes = {
      title: "Blog with hidden value",
      author: "Jane Doe",
      url: "https://example.com/hidden",
    };

    const response = await api
      .post("/api/blogs")
      .set("Authorization", tokenHeader) // Added token to fix old 4.11 test
      .send(newBlogWithoutLikes)
      .expect(201);

    assert.strictEqual(response.body.likes, 0);
  });

  test("blog without title or url returns 400 Bad Request", async () => {
    const badBlogNoTitle = {
      author: "No Title Author",
      url: "https://notitle.com",
    };
    const badBlogNoUrl = { title: "No URL Blog", author: "No URL Author" };

    await api
      .post("/api/blogs")
      .set("Authorization", tokenHeader)
      .send(badBlogNoTitle)
      .expect(400);
    await api
      .post("/api/blogs")
      .set("Authorization", tokenHeader)
      .send(badBlogNoUrl)
      .expect(400);
  });

  test("fails with 401 Unauthorized if token is not provided", async () => {
    const unauthBlog = {
      title: "Sneaky Blog",
      author: "Hacker",
      url: "https://hack.com",
    };

    await api.post("/api/blogs").send(unauthBlog).expect(401);
  });
});

describe("deletion of a blog", () => {
  test("succeeds with status code 204 if id is valid and owned by user", async () => {
    const blogsAtStart = await Blog.find({});
    const blogToDelete = blogsAtStart[0];

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set("Authorization", tokenHeader) // Deletion now requires a token from the owner (4.21*)
      .expect(204);

    const blogsAtEnd = await Blog.find({});
    assert.strictEqual(blogsAtEnd.length, blogsAtStart.length - 1);
  });
});

describe("updating a blog", () => {
  test("succeeds with status code 200 and updates the likes count", async () => {
    const blogsAtStart = await Blog.find({});
    const blogToUpdate = blogsAtStart[0];

    const updatedLikesPayload = { likes: blogToUpdate.likes + 100 };

    const response = await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(updatedLikesPayload)
      .expect(200);

    assert.strictEqual(response.body.likes, blogToUpdate.likes + 100);
  });
});

after(async () => {
  await mongoose.connection.close();
});

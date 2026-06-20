import "dotenv/config";
import { test, describe } from "node:test";
import assert from "node:assert";
import listHelper from "../utils/list_helper.js";

const blogs = [
  {
    _id: "1",
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
    __v: 0,
  },
  {
    _id: "2",
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
    __v: 0,
  },
  {
    _id: "3",
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
    __v: 0,
  },
  {
    _id: "4",
    title: "First class tests",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestFirst.html",
    likes: 10,
    __v: 0,
  },
  {
    _id: "5",
    title: "TDD harms architecture",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
    likes: 0,
    __v: 0,
  },
  {
    _id: "6",
    title: "Type wars",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    likes: 2,
    __v: 0,
  },
];

// 4.3
test("dummy returns one", () => {
  const result = listHelper.dummy([]);
  assert.strictEqual(result, 1);
});

// 4.4
describe("total likes", () => {
  test("when list is empty, equals zero", () => {
    assert.strictEqual(listHelper.totalLikes([]), 0);
  });

  test("when list has only one blog, equals the likes of that", () => {
    const listWithOneBlog = [blogs[1]];
    assert.strictEqual(listHelper.totalLikes(listWithOneBlog), 5);
  });

  test("when list has multiple blogs, calculates the sum correctly", () => {
    assert.strictEqual(listHelper.totalLikes(blogs), 36); // 7 + 5 + 12 + 10 + 0 + 2
  });
});

// 4.5
describe("favorite blog", () => {
  test("returns the blog object with the most likes", () => {
    const expected = {
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      likes: 12,
    };
    assert.deepStrictEqual(listHelper.favoriteBlog(blogs), expected);
  });
});

// 4.6
describe("most blogs", () => {
  test("identifies the author with the highest count of articles", () => {
    const expected = {
      author: "Robert C. Martin",
      blogs: 3,
    };
    assert.deepStrictEqual(listHelper.mostBlogs(blogs), expected);
  });
});

// 4.7
describe("most likes", () => {
  test("identifies the author with the cumulative maximum likes", () => {
    const expected = {
      author: "Edsger W. Dijkstra",
      likes: 17, // 5 + 12
    };
    assert.deepStrictEqual(listHelper.mostLikes(blogs), expected);
  });
});

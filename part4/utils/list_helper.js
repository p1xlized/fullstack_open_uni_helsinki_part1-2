

// 4.3
const dummy = (blogs) => {
  return 1;
};

// 4.4
const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + (blog.likes || 0), 0);
};

// 4.5
const favoriteBlog = (blogs) => {
  if (blogs.length === 0) return null;

  const favorite = blogs.reduce((max, blog) => {
    return (blog.likes || 0) > (max.likes || 0) ? blog : max;
  }, blogs[0]);

  return {
    title: favorite.title,
    author: favorite.author,
    likes: favorite.likes,
  };
};

// 4.6
const mostBlogs = (blogs) => {
  if (blogs.length === 0) return null;
  const counts = blogs.reduce((acc, blog) => {
    acc[blog.author] = (acc[blog.author] || 0) + 1;
    return acc;
  }, {});

  let topAuthor = "";
  let maxBlogs = 0;

  for (const [author, count] of Object.entries(counts)) {
    if (count > maxBlogs) {
      maxBlogs = count;
      topAuthor = author;
    }
  }

  return {
    author: topAuthor,
    blogs: maxBlogs,
  };
};

// 4.7
const mostLikes = (blogs) => {
  if (blogs.length === 0) return null;

  const likesMap = blogs.reduce((acc, blog) => {
    acc[blog.author] = (acc[blog.author] || 0) + (blog.likes || 0);
    return acc;
  }, {});

  let topAuthor = "";
  let maxLikes = -1;

  for (const [author, likes] of Object.entries(likesMap)) {
    if (likes > maxLikes) {
      maxLikes = likes;
      topAuthor = author;
    }
  }

  return {
    author: topAuthor,
    likes: maxLikes,
  };
};

export default {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};

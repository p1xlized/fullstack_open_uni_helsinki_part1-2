import config from "./utils/config.js";
import express from "express";
import cors from "cors";
import blogsRouter from "./controllers/blogs.js";
import usersRouter from "./controllers/user.js";
import loginRouter from "./controllers/login.js";
import middleware from "./utils/middleware.js";
import logger from "./utils/logger.js";
import mongoose from "mongoose";

const app = express();

logger.info("connecting to", config.MONGODB_URI);

mongoose.set("strictQuery", false);
mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    logger.info("connected to MongoDB");
  })
  .catch((error) => {
    logger.error("error connecting to MongoDB:", error.message);
  });

app.use(cors());
app.use(express.json());
// middleware
app.use(middleware.tokenExtractor);
// routes
app.use("/api/login", loginRouter);
app.use("/api/users", usersRouter);
app.use("/api/blogs", blogsRouter);

// error handler
const errorHandler = (error, request, response, next) => {
  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message });
  }

  next(error);
};

app.use(errorHandler);
export default app;

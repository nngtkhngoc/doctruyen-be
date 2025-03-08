import authRouter from "./authRouter.js";
import genreRouter from "./genreRouter.js";
import storyRouter from "./storyRouter.js";
import chapterRouter from "./chapterRouter.js";
import likeStoryRouter from "./likeStoryRouter.js";

export const routes = (app) => {
  app.use("/api/auth", authRouter);
  app.use("/api/genre", genreRouter);
  app.use("/api/story", storyRouter);
  app.use("/api/chapter", chapterRouter);
  app.use("/api/like_story", likeStoryRouter);
};

import authRouter from "./authRouter.js";
import genreRouter from "./genreRouter.js";
import storyRouter from "./storyRouter.js";
import chapterRouter from "./chapterRouter.js";
import blogRouter from "./blogRouter.js";
import chatbotRouter from "./chatbotRouter.js";
import oAuthRouter from "./oAuthRouter.js";

export const routes = (app) => {
  app.use("/api/auth", authRouter);
  app.use("/api/genres", genreRouter);
  app.use("/api/stories", storyRouter);
  app.use("/api/chapters", chapterRouter);
  app.use("/api/blogs", blogRouter);
  app.use("/api/chatbot", chatbotRouter);
  app.use("/api/oauth", oAuthRouter);
};

import authRouter from "./authRouter.js";
import genreRouter from "./genreRouter.js";

export const routes = (app) => {
  app.use("/api/auth", authRouter);
  app.use("/api/genre", genreRouter);
};

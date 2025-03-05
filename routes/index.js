import authRouter from "./authRouter.js";

export const routes = (app) => {
  app.use("/api/auth", authRouter);
};

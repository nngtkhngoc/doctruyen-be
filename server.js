import express from "express";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";
import { routes } from "./routes/index.js";
import cookieParser from "cookie-parser";
import "./jobs/index.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5001;

app.use(cookieParser());
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:5173", "https://sitedoctruyen.id.vn"],
    credentials: true,
  })
);
app.use(morgan("dev"));

app.get("/test-workflow", (req, res) => {
  return res.status(200).json({
    message: "Workflow is working",
  });
});
routes(app);
app.listen(PORT, () => {
  console.log("Server is listening on port", PORT);
});

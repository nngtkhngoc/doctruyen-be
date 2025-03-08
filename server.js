import express from "express";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";
import { routes } from "./routes/index.js";
import cookieParser from "cookie-parser";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5001;

app.use(cookieParser());
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

routes(app);
app.listen(PORT, () => {
  console.log("Server is listening on port", PORT);
});

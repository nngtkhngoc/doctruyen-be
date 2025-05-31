import express from "express";
import { handleUserInput } from "../controllers/chatbotController.js";
const router = express.Router();

router.post("/", handleUserInput);

export default router;
  
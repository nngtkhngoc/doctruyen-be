import {
  rateStory,
  updateStoryRating,
} from "../controllers/rateStoryController.js";
import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.post("/rate/:story_id", verifyToken, rateStory, updateStoryRating);
export default router;

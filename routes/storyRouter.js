import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import { verifyAdmin } from "../middleware/verifyAdmin.js";
import {
  getAllStories,
  getStory,
  createStory,
} from "../controllers/storyController.js";

const router = express.Router();

router.get("/get-all", getAllStories);
router.get("/get/story_id", getStory);
router.post("/create", createStory);

export default router;

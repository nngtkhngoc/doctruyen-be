import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import { verifyAdmin } from "../middleware/verifyAdmin.js";
import {
  getAllStories,
  getStory,
  createStory,
  deleteStory,
  updateStory,
} from "../controllers/storyController.js";

const router = express.Router();

router.get("/get-all", getAllStories);
router.get("/get-details/:story_id", getStory);
router.post("/create", verifyToken, verifyAdmin, createStory);
router.post("/delete/:story_id", verifyToken, verifyAdmin, deleteStory);
router.put("/update/:story_id", verifyToken, verifyAdmin, updateStory);

export default router;

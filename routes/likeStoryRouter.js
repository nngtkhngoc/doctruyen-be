import express from "express";
import { updateStoryLikes } from "../middleware/updateStoryLikes.js";
import {
  getAllLikesForStory,
  updateLikes,
  getAllLikesForUser,
} from "../controllers/likeStoryController.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.get("/get-all-for-story/:story_id", getAllLikesForStory);
router.get("/get-all-for-user", getAllLikesForUser);
router.post("/like/:story_id", verifyToken, updateLikes, updateStoryLikes);

export default router;

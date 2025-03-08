import express from "express";
import {
  updateLikes,
  updateStoryLikes,
  getAllLikesForUser,
} from "../controllers/likeStoryController.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.get("/get-all-for-user", verifyToken, getAllLikesForUser);
router.post("/like/:story_id", verifyToken, updateLikes, updateStoryLikes);

export default router;

import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import { verifyAdmin } from "../middleware/verifyAdmin.js";
import { upload } from "../middleware/multer.js";
import {
  getAllStories,
  getStory,
  createStory,
  deleteStory,
  updateStory,
  likeStory,
  updateLikeCounts,
  commentStory,
  deleteStoryComment,
  rateStory,
  updateStoryRating,
  importExcel,
} from "../controllers/storyController.js";
import { checkUserBanStatus } from "../middleware/checkUserBanStatus.js";

const router = express.Router();

router.get("/", getAllStories);
router.get("/:story_id", getStory);
router.post("/", verifyToken, verifyAdmin, createStory);
router.put("/:story_id", verifyToken, verifyAdmin, updateStory);
router.delete("/:story_id", verifyToken, verifyAdmin, deleteStory);

router.post("/:story_id/like", verifyToken, likeStory, updateLikeCounts);
router.post(
  "/:story_id/comment",
  verifyToken,
  checkUserBanStatus,
  commentStory
);
router.delete(
  "/:story_id/comment/:comment_id",
  verifyToken,
  deleteStoryComment
);
router.post("/:story_id/rate", verifyToken, rateStory, updateStoryRating);
router.post("/import-excel", upload.single("file"), importExcel);
export default router;

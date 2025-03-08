import {
  createStoryComment,
  deleteStoryComment,
  getAllCommentsForStory,
  getAllCommentsForUser,
} from "../controllers/commentStoryController.js";
import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import { checkUserBanStatus } from "../middleware/checkUserBanStatus.js";
const router = express.Router();

router.post(
  "/create/:story_id",
  verifyToken,
  checkUserBanStatus,
  createStoryComment
);
router.post("/delete/:comment_id", verifyToken, deleteStoryComment);
router.get("/get-all-for-users", verifyToken, getAllCommentsForUser);
router.get("/get-all-for-story/:story_id", getAllCommentsForStory);
export default router;

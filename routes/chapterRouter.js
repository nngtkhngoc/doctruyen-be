import express from "express";
import {
  createChapter,
  deleteChapter,
  getAllChapters,
  getChapter,
  updateChapter,
} from "../controllers/chapterController.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { verifyAdmin } from "../middleware/verifyAdmin.js";

const router = express.Router();

router.get("/get-all/:story_id", getAllChapters);
router.get("/get-details/:chapter_id", getChapter);
router.post("/create", verifyToken, verifyAdmin, createChapter);
router.post("/delete/:chapter_id", verifyToken, verifyAdmin, deleteChapter);
router.put("/update/:chapter_id", verifyToken, verifyAdmin, updateChapter);

export default router;

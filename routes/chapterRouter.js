import express from "express";
import {
  createChapter,
  deleteChapter,
  getChapter,
  updateChapter,
  importExcel,
  getAudioChapter,
} from "../controllers/chapterController.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { verifyAdmin } from "../middleware/verifyAdmin.js";
const router = express.Router();

router.get("/:chapter_id", getChapter);
router.get("/:chapter_id/audio", getAudioChapter);
router.post("/", verifyToken, verifyAdmin, createChapter);
router.delete("/:chapter_id", verifyToken, verifyAdmin, deleteChapter);
router.put("/:chapter_id", verifyToken, verifyAdmin, updateChapter);
export default router;

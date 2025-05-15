import express from "express";
import {
  createChapter,
  deleteChapter,
  getChapter,
  updateChapter,
  importExcel,
} from "../controllers/chapterController.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { verifyAdmin } from "../middleware/verifyAdmin.js";
import { upload } from "../middleware/multer.js";
const router = express.Router();

router.get("/:chapter_id", getChapter);
router.post("/", verifyToken, verifyAdmin, createChapter);
router.delete("/:chapter_id", verifyToken, verifyAdmin, deleteChapter);
router.put("/:chapter_id", verifyToken, verifyAdmin, updateChapter);
router.post("/import-excel", upload.single("file"), importExcel);
export default router;

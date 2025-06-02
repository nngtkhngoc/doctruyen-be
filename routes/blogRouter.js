import express from "express";
import {
  createBlog,
  deleteBlog,
  getAllBlogs,
  getBlog,
  updateBlog,
} from "../controllers/blogController.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { checkUserBanStatus } from "../middleware/checkUserBanStatus.js";

const router = express.Router();

router.get("/", getAllBlogs);
router.get("/:blog_id", getBlog);
router.post("/", verifyToken, checkUserBanStatus, createBlog);
router.delete("/:blog_id", verifyToken, deleteBlog);
router.put("/:blog_id", verifyToken, updateBlog);

export default router;

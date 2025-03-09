import express from "express";
import {
  createBlog,
  deleteBlog,
  getAllBlogs,
  getAllBlogsForUser,
  getBlog,
} from "../controllers/blogController.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.get("/get-all", getAllBlogs);
router.get("/get-details/:blog_id", getBlog);
router.get("/get-all-for-user", verifyToken, getAllBlogsForUser);
router.post("/create", verifyToken, createBlog);
router.post("/delete/:blog_id", verifyToken, deleteBlog);

export default router;

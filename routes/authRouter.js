import {
  signUp,
  signIn,
  getUser,
  signOut,
  getAllUsers,
  verifyEmail,
  getVerificationToken,
  getResetPasswordToken,
  resetPassword,
  updateUser,
  banUser,
  getUserById,
  getLikedStories,
} from "../controllers/authController.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { verifyAdmin } from "../middleware/verifyAdmin.js";
import express from "express";
import multer from "multer";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get("/me", verifyToken, getUser);
router.get("/verification-token", verifyToken, getVerificationToken);
router.get("/:id", verifyToken, verifyAdmin, getUserById);
router.get("/", verifyToken, verifyAdmin, getAllUsers);
router.post("/sign-up", signUp);
router.post("/sign-in", signIn);
router.post("/sign-out", signOut);
router.put("/", verifyToken, upload.single("profile_pic"), updateUser);

router.post("/verify-email", verifyToken, verifyEmail);

router.post("/reset-password-token", getResetPasswordToken);
router.post("/reset-password/:reset_password_token", resetPassword);

router.put("/ban", verifyToken, verifyAdmin, banUser);

router.get("/liked-stories", verifyToken, getLikedStories);

export default router;

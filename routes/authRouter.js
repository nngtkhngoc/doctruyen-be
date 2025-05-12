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
} from "../controllers/authController.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { verifyAdmin } from "../middleware/verifyAdmin.js";
import express from "express";
import { verify } from "jsonwebtoken";

const router = express.Router();

router.get("/me", verifyToken, getUser);
router.get("/:id", verifyToken, verifyAdmin, getUserById);
router.get("/", verify, verifyAdmin, getAllUsers);
router.post("/sign-up", signUp);
router.post("/sign-in", signIn);
router.post("/sign-out", signOut);
router.put("/", verifyToken, updateUser);

router.get("/verification-token", verifyToken, getVerificationToken);
router.post("/verify-email", verifyToken, verifyEmail);

router.post("/reset-password-token", getResetPasswordToken);
router.post("/reset-password/:reset_password_token", resetPassword);

router.put("/ban", verifyToken, verifyAdmin, banUser);

export default router;

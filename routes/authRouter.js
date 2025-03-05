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
} from "../controllers/authController.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { verifyAdmin } from "../middleware/verifyAdmin.js";
import express from "express";

const router = express.Router();

router.get("/me", verifyToken, getUser);
router.get("/get-all", verifyToken, verifyAdmin, getAllUsers);
router.post("/sign-up", signUp);
router.post("/sign-in", signIn);
router.post("/sign-out", signOut);

router.get("/get-verification-token/:user_id", getVerificationToken);
router.post("/verify", verifyEmail);

router.post("/get-reset-password-token", getResetPasswordToken);
router.post("/reset-password/:reset_password_token", resetPassword);

export default router;

import { getAllUsers } from "../controllers/authController.js";

import express from "express";
const router = express.Router();

router.get("/get-all", getAllUsers);

export default router;

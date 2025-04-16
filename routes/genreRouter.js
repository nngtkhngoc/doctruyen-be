import {
  createGenre,
  deleteGenre,
  getAllGenres,
  getGenre,
} from "../controllers/genreController.js";

import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import { verifyAdmin } from "../middleware/verifyAdmin.js";

const router = express.Router();

router.get("/", getAllGenres);
router.get("/:genre_id", getGenre);
router.post("/", verifyToken, verifyAdmin, createGenre);
router.delete("/:genre_id", verifyToken, verifyAdmin, deleteGenre);

export default router;

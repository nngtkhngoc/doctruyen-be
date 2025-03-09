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

router.get("/get-all", getAllGenres);
router.get("/get-details/:genre_id", getGenre);
router.post("/create", verifyToken, verifyAdmin, createGenre);
router.post("/delete/:genre_id", verifyToken, verifyAdmin, deleteGenre);

export default router;

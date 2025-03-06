import { prisma } from "../config/db.js";
import { createGenreValidator } from "../validation/genreValidation.js";

export const getAllGenres = async (req, res) => {
  try {
    const genres = await prisma.genres.findMany();
    return res.status(200).json({ success: true, data: genres });
  } catch (error) {
    console.log("Error get all genres:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

export const getGenre = async (req, res) => {
  const { genre_id } = req.params;
  try {
    const genre = await prisma.genres.findUnique({ where: { genre_id } });

    return res.status(200).json({ success: true, data: genre });
  } catch (error) {
    console.log("Error get genre    :", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

export const createGenre = async (req, res) => {
  const { name } = req.body;
  try {
    await createGenreValidator.validateAsync(req.body);

    const checkGenre = await prisma.genres.findUnique({ where: { name } });
    if (checkGenre) {
      return res
        .status(409)
        .json({ success: false, message: "Genre already exists" });
    }

    const newGenre = await prisma.genres.create({ data: { name } });

    return res.status(200).json({ success: true, data: newGenre });
  } catch (error) {
    if (error.isJoi) {
      return res.status(400).json({
        success: false,
        message: error.details.map((err) => err.message),
      });
    }
    console.log("Error create genre: ", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

export const deleteGenre = async (req, res) => {
  const { genre_id } = req.params;

  try {
    const checkGenre = await prisma.genres.findUnique({ where: { genre_id } });

    if (!checkGenre) {
      return res
        .status(404)
        .json({ success: false, message: "Genre not found" });
    }

    await prisma.genres.delete({ where: { genre_id } });

    return res
      .status(200)
      .json({ success: true, message: "Delete genre successfully" });
  } catch (error) {
    console.log("Error delete genre", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

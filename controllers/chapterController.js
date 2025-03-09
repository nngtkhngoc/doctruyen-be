import { prisma } from "../config/db.js";
import {
  createChapterValidator,
  updaterChapterValidator,
} from "../validation/chapterValidation.js";
import { updateStoryValidator } from "../validation/storyValidation.js";

export const getAllChapters = async (req, res) => {
  let { limit, page } = req.query;
  const { story_id } = req.params;

  try {
    const pageSize = parseInt(limit);
    const currentPage = parseInt(page) || 1;

    const chapters = await prisma.chapters.findMany({
      where: { story_id },
      ...(pageSize > 0
        ? { take: pageSize, skip: (currentPage - 1) * pageSize }
        : {}),
      orderBy: { chapter_number: "desc" },
    });

    if (chapters) {
      return res.status(200).json({ success: true, data: chapters });
    }

    return res
      .status(404)
      .json({ success: false, message: "Chapters not found" });
  } catch (error) {
    console.log("Error get all chapters", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

export const getChapter = async (req, res) => {
  const { chapter_id } = req.params;
  try {
    const chapter = await prisma.chapters.findUnique({ where: { chapter_id } });

    if (chapter) {
      return res.status(200).json({ success: true, data: chapter });
    }

    return res
      .status(404)
      .json({ success: false, message: "Chapter not found" });
  } catch (error) {
    console.log("Error get chapter:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

export const createChapter = async (req, res) => {
  const data = req.body;
  try {
    await createChapterValidator.validateAsync(data);

    const createdChapter = await prisma.chapters.create({ data });

    return res.status(200).json({ data: createdChapter });
  } catch (error) {
    if (error.isJoi) {
      return res.status(400).json({
        success: false,
        message: error.details.map((err) => err.message),
      });
    }

    console.log("Error create chapter", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

export const deleteChapter = async (req, res) => {
  const { chapter_id } = req.params;
  try {
    await prisma.chapters.delete({ where: { chapter_id } });

    return res
      .status(200)
      .json({ success: true, message: "Delete chapter successfully" });
  } catch (error) {
    console.log("Error delete chapter:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

export const updateChapter = async (req, res) => {
  const { chapter_id } = req.params;
  const data = req.body;

  try {
    await updaterChapterValidator.validateAsync(data);

    const updatedChapter = await prisma.chapters.update({
      where: { chapter_id },
      data,
    });

    if (updatedChapter) {
      return res.status(200).json({ success: true, data: updatedChapter });
    }

    return res.status(404).json({ success: false, message: "User not found" });
  } catch (error) {
    if (error.isJoi) {
      return res.status(400).json({
        success: false,
        message: error.details.map((err) => err.message),
      });
    }

    console.log("Error update chapter", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

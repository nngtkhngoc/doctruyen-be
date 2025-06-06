import { prisma } from "../config/db.js";
import {
  createChapterValidator,
  updaterChapterValidator,
} from "../validation/chapterValidation.js";
import { updateStoryValidator } from "../validation/storyValidation.js";
import { getDataFromExcelData } from "../utils/getDataFromExcel.js";
import path from "path";
import fs from "fs";
import { textToSpeech } from "../utils/tts.js";
const audioPath = path.resolve("..", "audio", "chapters");
export const getChapter = async (req, res) => {
  const { chapter_id } = req.params;
  try {
    const chapter = await prisma.chapters.findUnique({
      where: { chapter_id },
    });

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
export const getAudioChapter = async (req, res) => {
  const { chapter_id } = req.params;
  const finalPath = path.join(audioPath, `${chapter_id}.mp3`);
  if (fs.existsSync(finalPath)) {
    res.setHeader("Content-Type", "audio/mpeg");
    return res.sendFile(finalPath);
  }

  try {
    const chapter = await prisma.chapters.findUnique({ where: { chapter_id } });
    await textToSpeech({ text: chapter.content, path: finalPath });
    return res.sendFile(finalPath);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.toString(),
    });
  }
};
export const importExcel = async (req, res) => {
  const data = getDataFromExcelData(req.file.buffer);
  const headers = data[0];
  // data.shift();
  console.log(data);
  // try {
  //   const chapters =
  //     (await Promise.all(
  //       data.map(async (row) => {
  //         let chapter = {};
  //         for (let i = 0; i < headers.length; i++) {
  //           chapter[headers[i]] = row[i];
  //         }
  //         try {
  //           return await storyService.createStory(story);
  //         } catch (error) {
  //           return error.toString();
  //         }
  //       })
  //     )) ?? [];
  //   return res.status(200).json({
  //     success: true,
  //     message: "Import chapters successfully",
  //     data: stories,
  //   });
  // } catch (error) {
  //   return res.status(500).json({
  //     success: false,
  //     message: error.toString(),
  //   });
  // }
};

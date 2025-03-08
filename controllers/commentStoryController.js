import { prisma } from "../config/db.js";

export const createStoryComment = async (req, res) => {
  const { user_id } = req;
  const { content } = req.body;
  const { story_id } = req.params;

  try {
    const createdComment = await prisma.story_comments.create({
      data: { user_id, story_id, content },
    });
    return res.status(200).json({ success: true, data: createdComment });
  } catch (error) {
    console.log("Error creating comment: ", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

export const deleteStoryComment = async (req, res) => {
  const { comment_id } = req.params;
  try {
    await prisma.story_comments.delete({ where: { comment_id } });

    return res
      .status(200)
      .json({ success: true, message: "Delete comment successfully" });
  } catch (error) {
    console.log("Error deleting comment: ", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

export const getAllCommentsForUser = async (req, res) => {
  const { user_id } = req;
  let { limit, page } = req.query;

  try {
    const pageSize = parseInt(limit);
    const currentPage = parseInt(page) || 1;
    const comments = await prisma.story_comments.findMany({
      where: { user_id },
      ...(pageSize > 0
        ? { take: pageSize, skip: (currentPage - 1) * pageSize }
        : {}),
      orderBy: { commented_at: "desc" },
      select: {
        commented_at: true,
        content: true,
        comment_id: true,
        story: { select: { title: true } },
      },
    });

    return res.status(200).json({ success: true, data: comments });
  } catch (error) {
    console.log("Error get all comments for users:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

export const getAllCommentsForStory = async (req, res) => {
  const { story_id } = req.params;
  let { limit, page } = req.query;

  try {
    const pageSize = parseInt(limit);
    const currentPage = parseInt(page) || 1;
    const comments = await prisma.story_comments.findMany({
      where: { story_id },
      ...(pageSize > 0
        ? { take: pageSize, skip: (currentPage - 1) * pageSize }
        : {}),
      orderBy: { commented_at: "desc" },
      select: {
        commented_at: true,
        content: true,
        comment_id: true,
        user: { select: { username: true } },
      },
    });

    return res.status(200).json({ success: true, data: comments });
  } catch (error) {
    console.log("Error get all comments for story:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

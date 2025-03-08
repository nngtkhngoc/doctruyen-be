import { prisma } from "../config/db.js";

export const getAllLikesForStory = async (req, res) => {
  const { story_id } = req.params;

  try {
    const likes = await prisma.story_likes.findMany({
      where: { story_id },
      select: {
        liked_at: true,
        user: { select: { username: true } },
      },
    });

    return res.status(200).json({ success: true, data: likes });
  } catch (error) {
    console.log("Error get all likes for story:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

export const updateLikes = async (req, res, next) => {
  const { action, story_id } = req.params;
  const user_id = req.user_id;

  try {
    const checkLike = await prisma.story_likes.findUnique({
      where: { user_id_story_id: { user_id, story_id } },
    });

    if (checkLike) {
      await prisma.story_likes.delete({
        where: { user_id_story_id: { user_id, story_id } },
      });
    } else {
      await prisma.story_likes.create({ data: { user_id, story_id } });
    }

    req.story_id = story_id;
    next();

    //   return res.status(200).json({ success: true, like_counts: count });
  } catch (error) {
    console.log("Error like story", error);
    console.log(user_id, " ", action, " ", story_id);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

export const getAllLikesForUser = async (req, res) => {
  const { user_id } = req;
  let { limit, page } = req.query;

  try {
    const pageSize = parseInt(limit);
    const currentPage = parseInt(page) || 1;
    const likes = await prisma.story_likes.findMany({
      where: { user_id },
      ...(pageSize > 0
        ? { take: pageSize, skip: (currentPage - 1) * pageSize }
        : {}),
      orderBy: { liked_at: "desc" },
      select: {
        liked_at: true,
        story: { select: { title: true } },
      },
    });

    return res.status(200).json({ success: true, data: likes });
  } catch (error) {
    console.log("Error get all likes for users:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

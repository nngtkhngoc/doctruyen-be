import { prisma } from "../config/db.js";

export const updateStoryLikes = async (req, res) => {
  const { story_id } = req;
  try {
    const count = await prisma.story_likes.count({
      where: { story_id },
    });

    await prisma.stories.update({
      where: { story_id },
      data: { like_counts: count },
    });

    return res.status(200).json({ story_id, like_counts: count });
  } catch (error) {
    console.log("Error update story likes middleware:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

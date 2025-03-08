import { prisma } from "../config/db.js";

export const rateStory = async (req, res, next) => {
  const { user_id } = req;
  const { story_id } = req.params;
  const { score } = req.body;

  try {
    if (score < 1 || score > 5) {
      return res.status(400).json({ success: false });
    }

    const existRating = await prisma.ratings.findUnique({
      where: { user_id_story_id: { user_id, story_id } },
    });

    if (existRating) {
      await prisma.ratings.update({
        where: { user_id_story_id: { user_id, story_id } },
        data: { score },
      });
    } else {
      await prisma.ratings.create({
        data: { user_id, story_id, score },
      });
    }

    req.story_id = story_id;

    next();
  } catch (error) {
    console.log("Error rating story: ", error);
    return res
      .status(500)
      .json({ success: false, mesasge: "Internal Server Error" });
  }
};

export const updateStoryRating = async (req, res) => {
  const { story_id } = req;
  try {
    const ratingResult = await prisma.ratings.aggregate({
      where: { story_id },
      _avg: { score: true },
    });

    const rating_avg = ratingResult._avg?.score || 0;
    await prisma.stories.update({
      where: { story_id },
      data: { rating_avg },
    });

    return res.status(200).json({ story_id, rating_avg: ratingResult });
  } catch (error) {
    console.log("Error update story avg ratings middleware:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

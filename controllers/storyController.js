import { prisma } from "../config/db.js";
import { createStoryValidator } from "../validation/storyValidation.js";

export const getAllStories = async (req, res) => {
  let { limit, page, sort = "title", order = "desc", filter_value } = req.query;

  try {
    if (
      ![
        "title",
        "like_counts",
        "comment_counts",
        "rating_avg",
        "published_at",
        "price",
      ].includes(sort)
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid sort field" });
    }

    if (!["asc", "desc"].includes(order)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid order field" });
    }

    const pageSize = parseInt(limit);
    const currentPage = parseInt(page) || 1;

    let whereCondition = {};
    if (filter_value) {
      whereCondition = {
        OR: [
          { title: { contains: filter_value, mode: "insensitive" } },
          { author_name: { contains: filter_value, mode: "insensitive" } },
        ],
      };
    }

    const stories = await prisma.stories.findMany({
      where: whereCondition,
      ...(pageSize > 0
        ? { take: pageSize, skip: (currentPage - 1) * pageSize }
        : {}),
      orderBy: { [sort]: order },
      include: {
        story_genres: {
          include: {
            genre: true,
          },
        },
      },
    });

    return res.status(200).json({ success: true, data: stories });
  } catch (error) {
    console.error("Error get all stories", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

export const getStory = async (req, res) => {
  const { story_id } = req.params;
  try {
    const story = await prisma.stories.findUnique({ where: { story_id } });

    if (story) {
      return res.status(200).json({ success: true, data: story });
    }

    return res.status(404).json({ success: false, message: "Story not found" });
  } catch (error) {
    console.error("Error get story", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

export const createStory = async (req, res) => {
  const data = req.body;
  try {
    await createStoryValidator.validateAsync(data);
  } catch (error) {}
};

export const updateStory = async (req, res) => {};

export const deleteStory = async (req, res) => {};

import { prisma } from "../config/db.js";
import {
  createStoryValidator,
  updateStoryValidator,
} from "../validation/storyValidation.js";
import cloudinary from "../config/cloudinary.js";
import { getDataFromExcelData } from "../utils/getDataFromExcel.js";
import storyService from "../services/storyService.js";
export const getAllStories = async (req, res) => {
  let {
    limit,
    page,
    sort = "title",
    order = "desc",
    genres,
    authors,
    title,
  } = req.query;

  try {
    if (
      !["title", "like_counts", "rating_avg", "published_at", "price"].includes(
        sort
      )
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

    const pageSize = parseInt(limit) || 10;
    const currentPage = parseInt(page) || 1;

    let whereCondition = {};

    if (genres) {
      const genreList = genres.split(",").map((g) => g.trim());
      whereCondition.story_genres = {
        some: {
          genre: {
            name: { in: genreList, mode: "insensitive" },
          },
        },
      };
    }

    if (authors) {
      const authorList = authors.split(",").map((a) => a.trim());
      whereCondition.OR = authorList.map((author) => ({
        author_name: { contains: author, mode: "insensitive" },
      }));
    }

    if (title) {
      whereCondition = {
        title: { contains: title, mode: "insensitive" },
      };
    }

    const stories = await prisma.stories.findMany({
      where: whereCondition,
      take: pageSize,
      skip: (currentPage - 1) * pageSize,
      orderBy: { [sort]: order },
      include: {
        story_genres: {
          select: {
            genre: true,
          },
        },
        story_comments: { orderBy: { commented_at: "desc" } },
        story_chapters: { orderBy: { chapter_number: "asc" } },
      },
    });

    const total = await prisma.stories.count({ where: whereCondition });

    return res.status(200).json({ success: true, data: stories, total: total });
  } catch (error) {
    console.error("Error getting stories:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

export const getStory = async (req, res) => {
  const { story_id } = req.params;
  try {
    const story = await prisma.stories.findUnique({
      where: { story_id },
      include: {
        story_genres: {
          select: {
            genre: true,
          },
        },
        story_comments: {
          orderBy: { commented_at: "desc" },
          include: { user: { select: { username: true } } },
        },
        story_chapters: { orderBy: { chapter_number: "asc" } },
      },
    });

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

    if (data.cover_image) {
      const uploadRes = await cloudinary.uploader.upload(data.cover_image);
      data.cover_image = uploadRes.secure_url;
    }

    const createdStory = await prisma.stories.create({
      data: {
        title: data.title,
        author_name: data.author_name,
        description: data.description,
        cover_image: data.cover_image || "",
        status: data.status || "DRAFT",
        progress: data.progress || "ON_GOING",
        story_genres: {
          create: data.genres.map((genre) => ({
            genre: {
              connectOrCreate: {
                where: { name: genre },
                create: { name: genre },
              },
            },
          })),
        },
      },
      include: {
        story_genres: { select: { genre: { select: { name: true } } } },
      },
    });

    const formattedStories = {
      ...createdStory,
      story_genres: createdStory.story_genres.map((g) => g.genre.name),
    };

    return res.status(201).json({ success: true, data: formattedStories });
  } catch (error) {
    if (error.isJoi) {
      return res.status(400).json({
        success: false,
        message: error.details.map((err) => err.message),
      });
    }
    console.error("Error creating story", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

export const updateStory = async (req, res) => {
  const { story_id } = req.params;
  const data = req.body;

  try {
    await updateStoryValidator.validateAsync(data);
    const genres = data.genres || [];

    if (data.genres) {
      delete data.genres;
    }

    if (data.cover_image) {
      const uploadRes = await cloudinary.uploader.upload(data.cover_image);
      data.cover_image = uploadRes.secure_url;
    }

    const updatedStory = await prisma.stories.update({
      where: { story_id },
      data: {
        ...data,
        story_genres: {
          deleteMany: { story_id },
          create: genres.map((genre) => ({
            genre: {
              connectOrCreate: {
                where: { name: genre },
                create: { name: genre },
              },
            },
          })),
        },
      },
      include: {
        story_genres: {
          select: {
            genre: { select: { name: true } },
          },
        },
        story_comments: {
          select: {
            user: { select: { username: true } },
            comment_id: true,
            commented_at: true,
            content: true,
          },
        },
      },
    });

    const formattedStory = {
      ...updatedStory,
      story_genres: updatedStory.story_genres.map((g) => g.genre.name),
    };

    return res.status(200).json({ success: true, data: formattedStory });
  } catch (error) {
    if (error.isJoi) {
      return res.status(400).json({
        success: false,
        message: error.details.map((err) => err.message),
      });
    }
    console.log("Error update story: ", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

export const deleteStory = async (req, res) => {
  const { story_id } = req.params;
  try {
    await prisma.stories.delete({ where: { story_id } });

    return res
      .status(200)
      .json({ success: true, message: "Delete story successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

export const likeStory = async (req, res, next) => {
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
  } catch (error) {
    console.log("Error like story", error);
    console.log(user_id, " ", action, " ", story_id);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

export const updateLikeCounts = async (req, res) => {
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

export const commentStory = async (req, res) => {
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

export const importExcel = async (req, res) => {
  const data = getDataFromExcelData(req.file.buffer);
  const headers = data[0];
  data.shift();
  try {
    const stories =
      (await Promise.all(
        data.map(async (row) => {
          let story = {};

          for (let i = 0; i < headers.length; i++) {
            if (headers[i] === "genres") {
              story[headers[i]] = row[i].split(",");
              continue;
            }
            story[headers[i]] = row[i];
          }
          try {
            return await storyService.createStory(story);
          } catch (error) {
            console.log("Error creating story from excel: ", error);

            return null;
          }
        })
      )) ?? [];
    return res.status(200).json({
      success: true,
      message: "Import stories successfully",
      data: stories,
    });
  } catch (error) {
    // console.log("stories", stories);
    return res.status(500).json({
      success: false,
      message: error.toString(),
    });
  }
};

export const getSimilarStories = async (req, res) => {
  const { story_id } = req.params;
  try {
    // Get the current story's genres
    const currentStory = await prisma.stories.findUnique({
      where: { story_id },
      include: {
        story_genres: {
          select: {
            genre: {
              select: {
                genre_id: true,
              },
            },
          },
        },
      },
    });

    if (!currentStory) {
      return res
        .status(404)
        .json({ success: false, message: "Story not found" });
    }

    const genreIds = currentStory.story_genres.map((sg) => sg.genre.genre_id);

    // Find stories with similar genres, excluding the current story
    const similarStories = await prisma.stories.findMany({
      where: {
        story_id: { not: story_id },
        story_genres: {
          some: {
            genre_id: { in: genreIds },
          },
        },
      },
      include: {
        story_genres: {
          select: {
            genre: true,
          },
        },
      },
      take: 4,
      orderBy: {
        rating_avg: "desc",
      },
    });

    return res.status(200).json({ success: true, data: similarStories });
  } catch (error) {
    console.error("Error getting similar stories:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

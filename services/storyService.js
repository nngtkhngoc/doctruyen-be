import {
  createStoryValidator,
  updateStoryValidator,
} from "../validation/storyValidation.js";
import cloudinary from "../config/cloudinary.js";
import { prisma } from "../config/db.js";
export const createStory = async (data) => {
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

  return formattedStories;
};

export default {
  createStory,
};

import nodeCron from "node-cron";
import { prisma } from "../config/db.js";
import fs from "fs";
import path from "path";
import * as dotenv from "dotenv";
dotenv.config();
const filepath = path.resolve("docs", "top50.txt");
import {
  uploadFileOpenAI,
  linkFileToVectorStore,
  removeFilesByName,
} from "../openai/openai.js";

nodeCron.schedule("0 * * * * *", async () => {
  const stories = await prisma.stories.findMany({
    orderBy: {
      like_counts: "desc",
    },
    take: 50,
    include: {
      story_genres: {
        select: {
          genre: true,
        },
      },
    },
  });
  let content = "";

  stories.forEach((story, index) => {
    let text = ` Truyện thứ ${index}.
      ID truyện ${story.story_id}
      Ảnh bìa: ${story.cover_image}
      Tên truyện: ${story.title}
      Số lượt thích: ${story.like_counts}
      Tỉ lệ đánh gía: ${story.rating_avg}
      Mô tả: ${story.description}
      Link: ${process.env.FRONTEND_URL}/story/${story.story_id}
      `;
    text += "Thể loại: ";
    // console.log(story);
    story.story_genres.forEach((genre) => {
      text += `${genre.genre.name}, `;
    });
    text += "\n";
    content += text;
  });
  // content += "FLAG:";
  // content += Math.random().toString();
  fs.writeFileSync(filepath, content);
  await removeFilesByName("top50.txt");

  const file = await uploadFileOpenAI(filepath);
  const vectorStoreId = process.env.OPENAI_VECTOR_STORE_ID;
  const response = await linkFileToVectorStore(vectorStoreId, [file.id]);
});

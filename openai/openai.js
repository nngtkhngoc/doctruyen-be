import OpenAI from "openai";
import * as dotenv from "dotenv";

import fs from "fs";
dotenv.config();
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY,
});

function sleep(ms) {
  return new Promise((resolve, reject) => setTimeout(resolve, ms));
}
async function wait_on_run(run, thread) {
  while (run.status === "queued" || run.status === "in_progress") {
    run = await openai.beta.threads.runs.retrieve(thread.id, run.id);
    await sleep(1000);
  }
  return run;
}
async function getAssistantResponse(prompt) {
  prompt +=
    "Khi trả lời, xin hãy không hiển thị các chú thích dạng [4:...top50.txt] hoặc bất kỳ tham chiếu nào đến nguồn tệp.";
  prompt +=
    "Nếu là hỏi về truyện thì hãy trả về HTML có sử dụng taildwindcss và trả dưới dạng list, từng truyện là từng cái div. mỗi truyện trên 1 hàng. Có thẻ image và chỉ chứa các thông tin như tên truyện, ảnh bìa. Bắt buộc phải dùng thẻ Link bọc thẻ img(to=Link trong truyện). Sử dụng nền trắng chữ đen";
  const thread = await openai.beta.threads.create();
  const message = await openai.beta.threads.messages.create(thread.id, {
    role: "user",
    content: prompt,
  });
  let run = await openai.beta.threads.runs.create(thread.id, {
    assistant_id: process.env.OPENAI_ASSISTANT_ID,
  });
  console.log(process.env.OPENAI_ASSISTANT_ID, "assistant_id");
  run = await wait_on_run(run, thread);
  const messages = await openai.beta.threads.messages.list(thread.id);
  const lastMessage = messages.data[0].content[0].text.value;
  return lastMessage;
}
const uploadFileOpenAI = async (filepath) => {
  const file = await openai.files.create({
    file: fs.createReadStream(filepath),
    purpose: "assistants",
  });
  return file;
};
const linkFileToVectorStore = async (vectorStoreId, file_ids) => {
  const response = await openai.vectorStores.fileBatches.create(vectorStoreId, {
    file_ids: file_ids,
  });
  return response;
};
const removeFilesByName = async (name) => {
  const list = await openai.files.list();

  const filesToDelete = list.data.filter((file) => file.filename === name);
  await Promise.all[
    filesToDelete.forEach(async (file) => {
      return await openai.files.del(file.id);
    })
  ];
};
export {
  getAssistantResponse,
  uploadFileOpenAI,
  linkFileToVectorStore,
  removeFilesByName,
};

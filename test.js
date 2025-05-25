import fs from "fs";
import path from "path";

let __dirname = path.resolve();
let filePath = path.join(
  __dirname,
  "uploads",
  "chapters",
  "chapter_id",
  ".mp3"
);
let result = fs.mkdirSync(filePath, { recursive: true });

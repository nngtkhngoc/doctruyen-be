import gTTS from "gtts";
export function textToSpeech({ text, path }) {
  console.log(text);
  return new Promise((resolve, reject) => {
    const gtts = new gTTS(text, "vi");
    gtts.save(path, (error) => {
      console.log(error, "ERR");
      if (error) {
        console.log("ERROR here");
        console.error("Error saving audio file:", error);
        reject(error);
      }
      resolve(path);
    });
  });
}

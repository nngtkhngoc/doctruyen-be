import Joi from "@hapi/joi";

export const createChapterValidator = Joi.object({
  title: Joi.string().min(2).max(255).required().messages({
    "any.required": "Chapter title is required",
    "string.empty": "Chapter title must not be empty",
    "string.min": "Chapter title must be at least 2 characters",
    "string.max": "Chapter title must not be over 255 characters",
  }),
  chapter_number: Joi.number().min(0).required().messages({
    "any.required": "Chapter number is required",
    "number.min": "Chapter number must be greater than or equal to 0",
  }),
  content: Joi.string().min(2).required().messages({
    "any.required": "Chapter content is required",
    "string.empty": "Chapter content must not be empty",
    "string.min": "Chapter content must be at least 2 characters",
    "string.max": "Chapter content must not be over 255 characters",
  }),
  status: Joi.string(),
  story_id: Joi.string(),
});

export const updaterChapterValidator = Joi.object({
  title: Joi.string().min(2).max(255).messages({
    "any.required": "Chapter title is required",
    "string.empty": "Chapter title must not be empty",
    "string.min": "Chapter title must be at least 2 characters",
    "string.max": "Chapter title must not be over 255 characters",
  }),
  chapter_number: Joi.number().min(0).messages({
    "any.required": "Chapter number is required",
    "number.min": "Chapter number must be greater than or equal to 0",
  }),
  content: Joi.string().min(2).messages({
    "any.required": "Chapter content is required",
    "string.empty": "Chapter content must not be empty",
    "string.min": "Chapter content must be at least 2 characters",
    "string.max": "Chapter content must not be over 255 characters",
  }),
  status: Joi.string(),
  story_id: Joi.string(),
});

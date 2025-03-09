import Joi from "@hapi/joi";

export const createBlogValidator = Joi.object({
  title: Joi.string().min(2).max(255).required().messages({
    "any.required": "Blog title is required",
    "string.empty": "Blog title must not be empty",
    "string.min": "Blog title must be at least 2 characters",
    "string.max": "Blog title must not be over 255 characters",
  }),
  content: Joi.string().min(2).required().messages({
    "any.required": "Blog content is required",
    "string.empty": "Blog content must not be empty",
    "string.min": "Blog content must be at least 2 characters",
    "string.max": "Blog content must not be over 255 characters",
  }),
  author_id: Joi.string(),
  cover_image: Joi.string(),
});

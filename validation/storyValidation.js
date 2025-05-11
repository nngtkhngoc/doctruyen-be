import Joi from "@hapi/joi";

export const createStoryValidator = Joi.object({
  title: Joi.string().min(1).max(255).required().messages({
    "any.required": "Story title is required",
    "string.empty": "Story title must not be empty",
    "string.min": "Story title must be at least 4 characters",
    "string.max": "Story title must not be over 255 characters",
  }),
  author_name: Joi.string()
    .pattern(/^[A-Za-zÀ-Ỹà-ỹ\s]+$/)
    .min(4)
    .max(255)
    .required()
    .messages({
      "any.required": "Author name is required",
      "string.empty": "Author name must not be empty",
      "string.pattern.base": "Author name is unvalid",
      "string.min": "Author name must be at least 4 characters",
      "string.max": "Author name must not be over 255 characters",
    }),
  description: Joi.string().min(4).max(1000).required().messages({
    "any.required": "Story description is required",
    "string.empty": "Story description must not be empty",
    "string.min": "Story description must be at least 4 characters",
    "string.max": "Story description must not be over 1000 characters",
  }),
  cover_image: Joi.string(),
  price: Joi.number().min(0).messages({
    "number.min": "Story price must be at least 0$.",
  }),
  status: Joi.string(),
  progress: Joi.string(),
  genres: Joi.array().items(Joi.string()).min(1).required(),
});

export const updateStoryValidator = Joi.object({
  title: Joi.string().min(4).max(255).messages({
    "any.required": "Story title is required",
    "string.empty": "Story title must not be empty",
    "string.min": "Story title must be at least 4 characters",
    "string.max": "Story title must not be over 255 characters",
  }),
  author_name: Joi.string()
    .pattern(/^[A-Za-zÀ-Ỹà-ỹ\s]+$/)
    .min(4)
    .max(255)
    .messages({
      "string.empty": "Author name must not be empty",
      "string.pattern.base": "Author name is unvalid",
      "string.min": "Author name must be at least 4 characters",
      "string.max": "Author name must not be over 255 characters",
    }),
  description: Joi.string().min(4).max(2000).messages({
    "string.empty": "Story description must not be empty",
    "string.min": "Story description must be at least 4 characters",
    "string.max": "Story description must not be over 2000 characters",
  }),
  cover_image: Joi.string(),
  price: Joi.number().min(0).messages({
    "number.min": "Story price must be at least 0$.",
  }),
  status: Joi.string(),
  genres: Joi.array().items(Joi.string()).min(1),
  progress: Joi.string(),
});

import Joi from "@hapi/joi";

export const createGenreValidator = Joi.object({
  name: Joi.string()
    .pattern(/^[A-Za-zÀ-Ỹà-ỹ\s]+$/)
    .min(4)
    .max(255)
    .messages({
      "string.empty": "Genre name must no be empty",
      "string.pattern.base": "Genre name is unvalid",
      "string.min": "Genre name must be at least 4 characters",
      "string.max": "Genre name must not be over 255 characters",
    }),
});

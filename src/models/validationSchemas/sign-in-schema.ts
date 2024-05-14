import * as Joi from "joi";

export const signInSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string()
    .min(8)
    .regex(/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/)
    .message(
      "Password must be at least 8 characters long and contain at least 1 letter, 1 number, and 1 special character",
    )
    .required(),
});

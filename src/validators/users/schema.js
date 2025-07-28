import Joi from "joi";

export const UserPayloadSchema = Joi.object({
  name: Joi.string().required(),
  position: Joi.string().required(),
  username: Joi.string().required(),
  password: Joi.string().required(),
});
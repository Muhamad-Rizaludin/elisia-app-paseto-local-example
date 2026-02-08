import * as yup from "yup";

export const registerValidator = yup.object({
  name: yup.string().min(2).max(120).required(),
  email: yup.string().email().max(120).required(),
  password: yup.string().min(8).max(64).required()
});

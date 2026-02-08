import * as yup from "yup";

export const loginValidator = yup.object({
  email: yup.string().email().max(120).required(),
  password: yup.string().min(8).max(64).required()
});

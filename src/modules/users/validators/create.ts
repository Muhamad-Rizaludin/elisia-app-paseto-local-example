import * as yup from "yup";
import { RoleName } from "@modules/auth/types/enums";

export const usersCreateValidator = yup.object({
  name: yup.string().min(2).max(120).required(),
  email: yup.string().email().max(120).required(),
  password: yup.string().min(8).max(64).required(),
  role: yup.mixed<RoleName>().oneOf(Object.values(RoleName)).optional()
});

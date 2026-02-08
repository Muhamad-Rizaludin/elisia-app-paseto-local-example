import * as yup from "yup";
import { RoleName } from "@modules/auth/types/enums";

export const usersUpdateValidator = yup.object({
  name: yup.string().min(2).max(120).optional(),
  email: yup.string().email().max(120).optional(),
  password: yup.string().min(8).max(64).optional(),
  role: yup.mixed<RoleName>().oneOf(Object.values(RoleName)).optional()
}).test("at-least-one", "At least one field is required", (value) => {
  if (!value) {
    return false;
  }

  return Boolean(value.name || value.email || value.password || value.role);
});

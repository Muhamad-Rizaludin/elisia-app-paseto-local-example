import * as yup from "yup";

export const refreshValidator = yup.object({
  refreshToken: yup.string().optional()
});

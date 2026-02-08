import * as yup from "yup";

export const userIdParamValidator = yup.object({
  id: yup.number().integer().min(1).required()
});

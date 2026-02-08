import * as yup from 'yup'

export const userIdParamValidator = yup.object({
  id: yup.string().uuid().required()
});

import * as yup from 'yup'

export const userIdParamValidator = yup.object({
  id: yup
    .number()
    .transform((value, originalValue) => {
      if (typeof originalValue === 'string' && originalValue.trim() !== '') {
        return Number(originalValue)
      }

      return value
    })
    .integer()
    .min(1)
    .required()
})

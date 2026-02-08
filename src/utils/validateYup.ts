import type { AnyObjectSchema } from "yup";
import { validationError } from "@common/errorFactory";

export const validateYup = async <T>(schema: AnyObjectSchema, payload: unknown): Promise<T> => {
  try {
    const result = await schema.validate(payload, { abortEarly: false, stripUnknown: true });
    return result as T;
  } catch (error) {
    throw validationError("Validation failed", error);
  }
};

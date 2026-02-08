import bcrypt from "bcrypt";

export const hashValue = async (value: string): Promise<string> => {
  const rounds = Number(process.env.BCRYPT_ROUNDS || 10);
  return bcrypt.hash(value, rounds);
};

export const compareHash = async (value: string, hashedValue: string): Promise<boolean> =>
  bcrypt.compare(value, hashedValue);

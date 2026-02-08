type UserWithRoleShape = {
  id: string;
  name: string;
  email: string;
  role?: {
    name?: string;
  };
  createdAt?: Date;
};

export const extractRoleName = (user: unknown): string => {
  const mapped = user as UserWithRoleShape;
  return mapped.role?.name || "user";
};

export const sanitizeUser = (user: unknown) => {
  const mapped = user as UserWithRoleShape;

  return {
    id: mapped.id,
    name: mapped.name,
    email: mapped.email,
    role: mapped.role?.name || "user",
    createdAt: mapped.createdAt
  };
};

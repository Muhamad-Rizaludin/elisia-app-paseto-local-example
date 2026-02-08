import type { RoleName } from "@modules/auth/types/enums";

export type UserDatatableQuery = {
  page?: number;
  pageSize?: number;
  search?: string;
};

export type UserIdParams = {
  id: string;
};

export type CreateUserRequest = {
  name: string;
  email: string;
  password: string;
  role?: RoleName;
};

export type UpdateUserRequest = {
  name?: string;
  email?: string;
  password?: string;
  role?: RoleName;
};

export type UserItem = {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: Date;
};

export type CreateUserPayload = {
  roleId: string;
  name: string;
  email: string;
  passwordHash: string;
};

export type UpdateUserPayload = {
  roleId: string;
  name: string;
  email: string;
  passwordHash: string;
};

export type FindUsersDatatableParams = {
  limit: number;
  offset: number;
  search?: string;
};

export type FindUsersDatatableDependencies = {
  userModel: {
    findAndCountAll: (payload: Record<string, unknown>) => Promise<{ rows: unknown[]; count: number }>;
  };
};

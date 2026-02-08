export type UserDatatableQuery = {
  page?: number;
  pageSize?: number;
  search?: string;
};

export type UserIdParams = {
  id: number;
};

export type CreateUserRequest = {
  name: string;
  email: string;
  password: string;
  role?: string;
};

export type UpdateUserRequest = {
  name?: string;
  email?: string;
  password?: string;
  role?: string;
};

export type UserItem = {
  id: number;
  name: string;
  email: string;
  role: string;
  createdAt: Date;
};

export type CreateUserPayload = {
  roleId: number;
  name: string;
  email: string;
  passwordHash: string;
};

export type UpdateUserPayload = {
  roleId: number;
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

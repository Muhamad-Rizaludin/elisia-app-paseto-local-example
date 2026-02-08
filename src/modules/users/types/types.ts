export type UserDatatableQuery = {
  page?: number;
  pageSize?: number;
  search?: string;
};

export type UserItem = {
  id: number;
  name: string;
  email: string;
  role: string;
  createdAt: Date;
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

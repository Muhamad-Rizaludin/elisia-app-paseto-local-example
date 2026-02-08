import { afterAll, beforeAll, describe, expect, it } from "bun:test";
import dotenv from "dotenv";
import { Sequelize as SequelizeInstance, type QueryInterface, Sequelize as SequelizeStatic } from "sequelize";

dotenv.config({ path: ".env.test" });

const runMigration = async (migrationPath: string, queryInterface: QueryInterface) => {
  const migrationModule = await import(migrationPath);
  const migration = migrationModule.default || migrationModule;
  await migration.up(queryInterface, SequelizeStatic);
};

const runSeeder = async (seederPath: string, queryInterface: QueryInterface) => {
  const seederModule = await import(seederPath);
  const seeder = seederModule.default || seederModule;
  await seeder.up(queryInterface, SequelizeStatic);
};

const safeDropTable = async (queryInterface: QueryInterface, tableName: string) => {
  try {
    await queryInterface.dropTable(tableName);
  } catch {
    // Abaikan jika tabel belum ada.
  }
};

let app: { handle: (request: Request) => Promise<Response> };
let closeDatabase: () => Promise<void>;

const normalizeToken = (token?: string) =>
  token && token.toLowerCase().startsWith("bearer ") ? token.slice(7).trim() : token;

const callApi = (path: string, method: string, body?: Record<string, unknown>, token?: string) => {
  const headers: Record<string, string> = {};

  if (body) {
    headers["content-type"] = "application/json";
  }

  if (token) {
    headers.authorization = `Bearer ${token}`;
  }

  return app.handle(
    new Request(`http://localhost${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined
    })
  );
};

beforeAll(async () => {
  const tempSequelize = new SequelizeInstance({
    dialect: "postgres",
    host: process.env.DB_HOST || "127.0.0.1",
    port: Number(process.env.DB_PORT || 5432),
    database: process.env.DB_NAME || "elisia_test",
    username: process.env.DB_USER || "postgres",
    password: process.env.DB_PASS || "",
    logging: false
  });

  const queryInterface = tempSequelize.getQueryInterface();

  await safeDropTable(queryInterface, "refresh_tokens");
  await safeDropTable(queryInterface, "users");
  await safeDropTable(queryInterface, "roles");

  await runMigration("../../migrations/20260207010000-create-roles.js", queryInterface);
  await runMigration("../../migrations/20260207010100-create-users.js", queryInterface);
  await runMigration("../../migrations/20260207010200-create-refresh-tokens.js", queryInterface);
  await runMigration("../../migrations/20260208090000-add-deleted-to-users.js", queryInterface);
  await runMigration("../../migrations/20260208120000-convert-ids-to-uuid.js", queryInterface);

  await runSeeder("../../seeders/20260207010300-seed-roles.js", queryInterface);
  await runSeeder("../../seeders/20260207010400-seed-admin-user.js", queryInterface);

  await tempSequelize.close();

  const bootstrap = await import("@config/bootstrap");
  await bootstrap.bootstrapDatabase();
  closeDatabase = bootstrap.closeDatabase;

  const appModule = await import("@config/app");
  app = appModule.createApp();
}, 20000);

afterAll(async () => {
  if (closeDatabase) {
    await closeDatabase();
  }
}, 20000);

describe("integration auth flow", () => {
  it("runs register -> me -> validation -> admin users list -> refresh", async () => {
    const registerResponse = await callApi("/api/v1/auth/register", "POST", {
      name: "Ujang",
      email: "ujang@example.com",
      password: "StrongPass123!"
    });

    expect(registerResponse.status).toBe(200);
    const registerPayload = await registerResponse.json();
    const userToken = normalizeToken(registerPayload?.data?.token as string);
    expect(userToken?.length).toBeGreaterThan(10);

    const meResponse = await callApi("/api/v1/auth/me", "GET", undefined, userToken);
    expect(meResponse.status).toBe(200);

    const invalidLoginResponse = await callApi("/api/v1/auth/login", "POST", {
      email: "admin@example.com"
    });
    expect(invalidLoginResponse.status).toBe(422);

    const adminLoginResponse = await callApi("/api/v1/auth/login", "POST", {
      email: "admin@example.com",
      password: "Admin12345!"
    });
    expect(adminLoginResponse.status).toBe(200);
    const adminPayload = await adminLoginResponse.json();
    const adminToken = normalizeToken(adminPayload?.data?.token as string);
    const adminRefreshToken = adminPayload?.data?.refreshToken as string;
    expect(adminToken?.length).toBeGreaterThan(10);

    const usersResponse = await callApi("/api/v1/users?page=1&pageSize=5", "GET", undefined, adminToken);
    expect(usersResponse.status).toBe(200);

    const refreshResponse = await callApi("/api/v1/auth/refresh", "POST", { refreshToken: adminRefreshToken });
    expect(refreshResponse.status).toBe(200);
  });

  it("runs users CRUD flow", async () => {
    const adminLoginResponse = await callApi("/api/v1/auth/login", "POST", {
      email: "admin@example.com",
      password: "Admin12345!"
    });
    expect(adminLoginResponse.status).toBe(200);
    const adminPayload = await adminLoginResponse.json();
    const adminToken = normalizeToken(adminPayload?.data?.token as string);
    expect(adminToken?.length).toBeGreaterThan(10);

    const unique = Date.now();
    const createResponse = await callApi(
      "/api/v1/users",
      "POST",
      {
        name: `User ${unique}`,
        email: `user${unique}@example.com`,
        password: "Password123!",
        role: "user"
      },
      adminToken
    );

    expect(createResponse.status).toBe(200);
    const created = await createResponse.json();
    const userId = created?.data?.id as string;
    expect(userId).toMatch(/^[0-9a-fA-F-]{36}$/);

    const getResponse = await callApi(`/api/v1/users/${userId}`, "GET", undefined, adminToken);
    expect(getResponse.status).toBe(200);

    const updateResponse = await callApi(
      `/api/v1/users/${userId}`,
      "PATCH",
      {
        name: `User Updated ${unique}`,
        email: `user${unique}.updated@example.com`
      },
      adminToken
    );
    expect(updateResponse.status).toBe(200);

    const deleteResponse = await callApi(`/api/v1/users/${userId}`, "DELETE", undefined, adminToken);
    expect(deleteResponse.status).toBe(200);

    const getAfterDeleteResponse = await callApi(`/api/v1/users/${userId}`, "GET", undefined, adminToken);
    expect(getAfterDeleteResponse.status).toBe(404);
  });
});

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

const parseAuthCookies = (response: Response) => {
  const raw = response.headers.get("set-cookie") || "";
  const token = raw.match(/token=([^;]+)/)?.[1];
  const refreshToken = raw.match(/refreshToken=([^;]+)/)?.[1];

  const parts = [];
  if (token) {
    parts.push(`token=${token}`);
  }
  if (refreshToken) {
    parts.push(`refreshToken=${refreshToken}`);
  }

  return parts.join("; ");
};

let app: { handle: (request: Request) => Promise<Response> };
let closeDatabase: () => Promise<void>;

const callApi = (path: string, method: string, body?: Record<string, unknown>, cookies?: string) => {
  const headers: Record<string, string> = {};

  if (body) {
    headers["content-type"] = "application/json";
  }

  if (cookies) {
    headers.cookie = cookies;
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
    password: process.env.DB_PASS || "postgres",
    logging: false
  });

  const queryInterface = tempSequelize.getQueryInterface();

  await safeDropTable(queryInterface, "refresh_tokens");
  await safeDropTable(queryInterface, "users");
  await safeDropTable(queryInterface, "roles");

  await runMigration("../../migrations/20260207010000-create-roles.js", queryInterface);
  await runMigration("../../migrations/20260207010100-create-users.js", queryInterface);
  await runMigration("../../migrations/20260207010200-create-refresh-tokens.js", queryInterface);

  await runSeeder("../../seeders/20260207010300-seed-roles.js", queryInterface);
  await runSeeder("../../seeders/20260207010400-seed-admin-user.js", queryInterface);

  await tempSequelize.close();

  const bootstrap = await import("@config/bootstrap");
  await bootstrap.bootstrapDatabase();
  closeDatabase = bootstrap.closeDatabase;

  const appModule = await import("@config/app");
  app = appModule.createApp();
});

afterAll(async () => {
  if (closeDatabase) {
    await closeDatabase();
  }
});

describe("integration auth flow", () => {
  it("runs register -> me -> validation -> admin users list -> refresh", async () => {
    const registerResponse = await callApi("/api/v1/auth/register", "POST", {
      name: "Ujang",
      email: "ujang@example.com",
      password: "StrongPass123!"
    });

    expect(registerResponse.status).toBe(200);
    const userCookies = parseAuthCookies(registerResponse);
    expect(userCookies.length).toBeGreaterThan(0);

    const meResponse = await callApi("/api/v1/auth/me", "GET", undefined, userCookies);
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
    const adminCookies = parseAuthCookies(adminLoginResponse);

    const usersResponse = await callApi("/api/v1/users?page=1&pageSize=5", "GET", undefined, adminCookies);
    expect(usersResponse.status).toBe(200);

    const refreshResponse = await callApi("/api/v1/auth/refresh", "POST", undefined, adminCookies);
    expect(refreshResponse.status).toBe(200);
  });
});

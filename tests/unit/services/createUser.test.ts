import { describe, expect, it } from "bun:test";
import { createUser } from "@modules/users/services/createUser";

describe("createUser service", () => {
  it("throws when role not found", async () => {
    const deps = {
      findRoleByName: async () => null,
      findUserByEmail: async () => null,
      createUser: async () => ({ id: 1 }),
      findUserById: async () => null
    };

    await expect(
      createUser(
        {
          name: "Budi",
          email: "budi@example.com",
          password: "Password123!"
        },
        deps as never
      )
    ).rejects.toThrow("Role not found");
  });

  it("throws when email already exists", async () => {
    const deps = {
      findRoleByName: async () => ({ id: 2, name: "user" }),
      findUserByEmail: async () => ({ id: 99 }),
      createUser: async () => ({ id: 1 }),
      findUserById: async () => null
    };

    await expect(
      createUser(
        {
          name: "Budi",
          email: "budi@example.com",
          password: "Password123!"
        },
        deps as never
      )
    ).rejects.toThrow("Email already registered");
  });

  it("returns sanitized user on success", async () => {
    const deps = {
      findRoleByName: async () => ({ id: 2, name: "user" }),
      findUserByEmail: async () => null,
      createUser: async () => ({ id: 10 }),
      findUserById: async () => ({
        id: 10,
        name: "Budi",
        email: "budi@example.com",
        role: { name: "user" },
        createdAt: new Date("2026-02-08T00:00:00.000Z")
      })
    };

    const result = await createUser(
      {
        name: "Budi",
        email: "budi@example.com",
        password: "Password123!"
      },
      deps as never
    );

    expect(result.email).toBe("budi@example.com");
    expect(result.role).toBe("user");
  });
});

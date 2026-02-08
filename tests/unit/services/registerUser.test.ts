import { describe, expect, it } from "bun:test";
import { registerUser } from "@modules/auth/services/registerUser";

describe("registerUser service", () => {
  it("throws conflict when email already exists", async () => {
    const deps = {
      findRoleByName: async () => ({ id: 2, name: "user" }),
      findUserByEmail: async () => ({ id: 10 }),
      createUser: async () => ({ id: 11 }),
      findUserById: async () => null,
      createRefreshToken: async () => ({})
    };

    await expect(
      registerUser(
        {
          name: "Budi",
          email: "budi@example.com",
          password: "Password123!"
        },
        deps as never
      )
    ).rejects.toThrow("Email already registered");
  });

  it("returns user and token when register success", async () => {
    const deps = {
      findRoleByName: async () => ({ id: 2, name: "user" }),
      findUserByEmail: async () => null,
      createUser: async () => ({ id: 20 }),
      findUserById: async () => ({
        id: 20,
        name: "Budi",
        email: "budi@example.com",
        role: { name: "user" }
      }),
      createRefreshToken: async () => ({})
    };

    const result = await registerUser(
      {
        name: "Budi",
        email: "budi@example.com",
        password: "Password123!"
      },
      deps as never
    );

    expect(result.user.email).toBe("budi@example.com");
    expect(result.tokens.accessToken.length).toBeGreaterThan(10);
    expect(result.tokens.refreshToken.length).toBeGreaterThan(10);
  });
});

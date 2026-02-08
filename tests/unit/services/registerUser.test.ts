import { describe, expect, it } from "bun:test";
import { registerUser } from "@modules/auth/services/registerUser";

describe("registerUser service", () => {
  it("throws conflict when email already exists", async () => {
    const deps = {
      findRoleByName: async () => ({ id: "22222222-2222-2222-2222-222222222222", name: "user" }),
      findUserByEmail: async () => ({ id: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa" }),
      createUser: async () => ({ id: "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb" }),
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
      findRoleByName: async () => ({ id: "22222222-2222-2222-2222-222222222222", name: "user" }),
      findUserByEmail: async () => null,
      createUser: async () => ({ id: "cccccccc-cccc-cccc-cccc-cccccccccccc" }),
      findUserById: async () => ({
        id: "cccccccc-cccc-cccc-cccc-cccccccccccc",
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

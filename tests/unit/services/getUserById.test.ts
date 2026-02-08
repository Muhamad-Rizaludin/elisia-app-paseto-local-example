import { describe, expect, it } from "bun:test";
import { getUserById } from "@modules/users/services/getUserById";

describe("getUserById service", () => {
  it("throws when user not found", async () => {
    const deps = {
      findUserById: async () => null
    };

    await expect(getUserById("99999999-9999-9999-9999-999999999999", deps as never)).rejects.toThrow("User not found");
  });

  it("returns sanitized user", async () => {
    const deps = {
      findUserById: async () => ({
        id: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
        name: "Budi",
        email: "budi@example.com",
        role: { name: "admin" },
        createdAt: new Date("2026-02-08T00:00:00.000Z")
      })
    };

    const result = await getUserById("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa", deps as never);
    expect(result.id).toBe("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa");
    expect(result.role).toBe("admin");
  });
});

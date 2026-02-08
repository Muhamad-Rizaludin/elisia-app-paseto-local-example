import { describe, expect, it } from "bun:test";
import { getUserById } from "@modules/users/services/getUserById";

describe("getUserById service", () => {
  it("throws when user not found", async () => {
    const deps = {
      findUserById: async () => null
    };

    await expect(getUserById(999, deps as never)).rejects.toThrow("User not found");
  });

  it("returns sanitized user", async () => {
    const deps = {
      findUserById: async () => ({
        id: 10,
        name: "Budi",
        email: "budi@example.com",
        role: { name: "admin" },
        createdAt: new Date("2026-02-08T00:00:00.000Z")
      })
    };

    const result = await getUserById(10, deps as never);
    expect(result.id).toBe(10);
    expect(result.role).toBe("admin");
  });
});

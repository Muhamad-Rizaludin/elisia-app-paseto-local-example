import { describe, expect, it } from "bun:test";
import { updateUser } from "@modules/users/services/updateUser";

describe("updateUser service", () => {
  it("throws when user not found", async () => {
    const deps = {
      findUserById: async () => null,
      findUserByEmail: async () => null,
      findRoleByName: async () => null,
      updateUserById: async () => [1]
    };

    return expect(updateUser(999, { name: "New" }, deps as never)).rejects.toThrow("User not found");
  });

  it("throws when email already registered", async () => {
    const deps = {
      findUserById: async () => ({
        id: 10,
        name: "Budi",
        email: "budi@example.com",
        roleId: 2,
        passwordHash: "hash"
      }),
      findUserByEmail: async () => ({ id: 99 }),
      findRoleByName: async () => null,
      updateUserById: async () => [1]
    };

    return expect(
      updateUser(10, { email: "taken@example.com" }, deps as never)
    ).rejects.toThrow("Email already registered");
  });

  it("throws when role not found", async () => {
    const deps = {
      findUserById: async () => ({
        id: 10,
        name: "Budi",
        email: "budi@example.com",
        roleId: 2,
        passwordHash: "hash"
      }),
      findUserByEmail: async () => null,
      findRoleByName: async () => null,
      updateUserById: async () => [1]
    };

    return expect(updateUser(10, { role: "admin" }, deps as never)).rejects.toThrow("Role not found");
  });

  it("updates user successfully", async () => {
    let updatedPayload: Record<string, unknown> | undefined;

    const deps = {
      findUserById: async () => ({
        id: 10,
        name: "Budi",
        email: "budi@example.com",
        roleId: 2,
        passwordHash: "hash",
        role: { name: "user" }
      }),
      findUserByEmail: async () => null,
      findRoleByName: async () => ({ id: 1, name: "admin" }),
      updateUserById: async (_id: number, payload: Record<string, unknown>) => {
        updatedPayload = payload;
        return [1];
      }
    };

    const result = await updateUser(
      10,
      {
        name: "Budi Updated",
        role: "admin"
      },
      deps as never
    );

    expect(updatedPayload?.name).toBe("Budi Updated");
    expect(updatedPayload?.roleId).toBe(1);
    expect(result.role).toBe("user");
  });
});

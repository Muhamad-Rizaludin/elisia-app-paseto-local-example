import { describe, expect, it } from "bun:test";
import { updateUser } from "@modules/users/services/updateUser";
import { RoleName } from "@modules/auth/types/enums";

describe("updateUser service", () => {
  it("throws when user not found", async () => {
    const deps = {
      findUserById: async () => null,
      findUserByEmail: async () => null,
      findRoleByName: async () => null,
      updateUserById: async () => [1]
    };

    return expect(updateUser("99999999-9999-9999-9999-999999999999", { name: "New" }, deps as never)).rejects.toThrow("User not found");
  });

  it("throws when email already registered", async () => {
    const deps = {
      findUserById: async () => ({
        id: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
        name: "Budi",
        email: "budi@example.com",
        roleId: "22222222-2222-2222-2222-222222222222",
        passwordHash: "hash"
      }),
      findUserByEmail: async () => ({ id: "99999999-9999-9999-9999-999999999999" }),
      findRoleByName: async () => null,
      updateUserById: async () => [1]
    };

    return expect(
      updateUser("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa", { email: "taken@example.com" }, deps as never)
    ).rejects.toThrow("Email already registered");
  });

  it("throws when role not found", async () => {
    const deps = {
      findUserById: async () => ({
        id: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
        name: "Budi",
        email: "budi@example.com",
        roleId: "22222222-2222-2222-2222-222222222222",
        passwordHash: "hash"
      }),
      findUserByEmail: async () => null,
      findRoleByName: async () => null,
      updateUserById: async () => [1]
    };

    return expect(updateUser("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa", { role: "admin" as RoleName }, deps as never)).rejects.toThrow("Role not found");
  });

  it("updates user successfully", async () => {
    let updatedPayload: Record<string, unknown> | undefined;

    const deps = {
      findUserById: async () => ({
        id: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
        name: "Budi",
        email: "budi@example.com",
        roleId: "22222222-2222-2222-2222-222222222222",
        passwordHash: "hash",
        role: { name: "user" }
      }),
      findUserByEmail: async () => null,
      findRoleByName: async () => ({ id: "11111111-1111-1111-1111-111111111111", name: "admin" }),
      updateUserById: async (_id: string, payload: Record<string, unknown>) => {
        updatedPayload = payload;
        return [1];
      }
    };

    const result = await updateUser(
      "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
      {
        name: "Budi Updated",
        role: "admin" as RoleName
      },
      deps as never
    );

    expect(updatedPayload?.name).toBe("Budi Updated");
    expect(updatedPayload?.roleId).toBe("11111111-1111-1111-1111-111111111111");
    expect(result.role).toBe("user");
  });
});

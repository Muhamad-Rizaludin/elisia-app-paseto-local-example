import { describe, expect, it } from "bun:test";
import { deleteUser } from "@modules/users/services/deleteUser";
import { DeletedStatus } from "@plugins/common/types";

describe("deleteUser service", () => {
  it("throws not found when delete fails", async () => {
    const deps = {
      deleteUserById: async () => 0
    };

    return expect(deleteUser(999, deps as never)).rejects.toThrow("User not found");
  });

  it("passes deleted status and returns success", async () => {
    let capturedStatus: number | undefined;

    const deps = {
      deleteUserById: async (_id: number, status?: number) => {
        capturedStatus = status;
        return 1;
      }
    };

    await deleteUser(10, deps as never);
    expect(capturedStatus).toBe(DeletedStatus.TRUE);
  });
});

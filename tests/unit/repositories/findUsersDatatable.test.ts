import { describe, expect, it } from "bun:test";
import { findUsersDatatable } from "@modules/users/repositories/findUsersDatatable";

describe("findUsersDatatable repository", () => {
  it("builds search query and delegates to model", async () => {
    let capturedPayload: { limit?: number; offset?: number; where?: unknown } = {};

    const mockDeps = {
      userModel: {
        findAndCountAll: async (payload: Record<string, unknown>) => {
          capturedPayload = {
            limit: payload.limit as number | undefined,
            offset: payload.offset as number | undefined,
            where: payload.where
          };
          return { rows: [], count: 0 };
        }
      }
    };

    await findUsersDatatable(
      {
        limit: 10,
        offset: 0,
        search: "admin"
      },
      mockDeps
    );

    expect(capturedPayload.limit).toBe(10);
    expect(capturedPayload.offset).toBe(0);
    expect(capturedPayload.where).toBeDefined();
  });
});

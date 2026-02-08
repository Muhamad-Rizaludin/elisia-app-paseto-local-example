import { describe, expect, it } from "bun:test";
import { buildMeta, emptyMeta } from "@utils/pagination";

describe("pagination utils", () => {
  it("builds datatable meta correctly", () => {
    const meta = buildMeta(2, 10, 35);

    expect(meta.currentPage).toBe(2);
    expect(meta.pageSize).toBe(10);
    expect(meta.total).toBe(35);
    expect(meta.totalPage).toBe(4);
    expect(meta.hasNext).toBe(true);
    expect(meta.hasPrev).toBe(true);
  });

  it("returns empty meta", () => {
    const meta = emptyMeta();
    expect(meta.total).toBe(0);
    expect(meta.hasNext).toBe(false);
    expect(meta.hasPrev).toBe(false);
  });
});

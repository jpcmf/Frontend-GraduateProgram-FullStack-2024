import { describe, expect, it } from "vitest";

import { getPageNumbers } from "@/shared/hooks/usePagination";

describe("getPageNumbers", () => {
  it("returns every page when the total fits", () => {
    expect(getPageNumbers(1, 3)).toEqual([1, 2, 3]);
    expect(getPageNumbers(3, 7)).toEqual([1, 2, 3, 4, 5, 6, 7]);
  });

  it("windows a middle page with ellipses on both sides", () => {
    expect(getPageNumbers(10, 20)).toEqual([1, "…", 9, 10, 11, "…", 20]);
  });

  it("omits the leading ellipsis near the start", () => {
    expect(getPageNumbers(2, 20)).toEqual([1, 2, 3, "…", 20]);
    expect(getPageNumbers(1, 20)).toEqual([1, 2, "…", 20]);
  });

  it("omits the trailing ellipsis near the end", () => {
    expect(getPageNumbers(19, 20)).toEqual([1, "…", 18, 19, 20]);
    expect(getPageNumbers(20, 20)).toEqual([1, "…", 19, 20]);
  });

  it("clamps out-of-range pages", () => {
    expect(getPageNumbers(0, 10)).toEqual([1, 2, "…", 10]);
    expect(getPageNumbers(99, 10)).toEqual([1, "…", 9, 10]);
  });

  it("handles a single page", () => {
    expect(getPageNumbers(1, 1)).toEqual([1]);
  });
});

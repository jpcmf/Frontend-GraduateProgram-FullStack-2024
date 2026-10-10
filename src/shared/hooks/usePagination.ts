export type PageItem = number | "…";

const range = (start: number, end: number): number[] => Array.from({ length: end - start + 1 }, (_, i) => start + i);

/**
 * Build the page list for a paginated control, inserting ellipses when the
 * number of pages exceeds the visible window. Values are clamped to
 * [1, max(totalPages, 1)] so a stale current page never renders blank.
 */
export function getPageNumbers(currentPage: number, totalPages: number, siblingCount = 1): PageItem[] {
  const total = Math.max(totalPages, 1);
  const current = Math.min(Math.max(currentPage, 1), total);
  const totalPageNumbers = siblingCount * 2 + 5; // first + last + current + 2×siblings + ellipsis room

  if (total <= totalPageNumbers) return range(1, total);

  const leftSibling = Math.max(current - siblingCount, 1);
  const rightSibling = Math.min(current + siblingCount, total);
  const showLeftEllipsis = leftSibling > 2;
  const showRightEllipsis = rightSibling < total - 2;

  if (!showLeftEllipsis && showRightEllipsis) {
    return [...range(1, rightSibling), "…", total];
  }

  if (showLeftEllipsis && !showRightEllipsis) {
    return [1, "…", ...range(leftSibling, total)];
  }

  return [1, "…", ...range(leftSibling, rightSibling), "…", total];
}

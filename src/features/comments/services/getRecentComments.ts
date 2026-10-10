import { apiClient } from "@/shared/api/apiClient";

import type { CommentsResponse } from "../types/comments";

export async function getRecentComments(page: number | undefined, pageSize: number = 10): Promise<CommentsResponse> {
  const res = await apiClient.get(
    `/api/comments?sort=createdAt:desc&pagination[page]=${page ?? 1}&pagination[pageSize]=${pageSize}`
  );
  return res.data;
}

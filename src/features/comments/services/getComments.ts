import { apiClient } from "@/shared/api/apiClient";

import type { CommentsResponse } from "../types/comments";

export async function getComments(spotId: string | number): Promise<CommentsResponse> {
  const res = await apiClient.get(`/api/comments?filters[spot][id][$eq]=${spotId}&sort=createdAt:desc`);
  return res.data;
}

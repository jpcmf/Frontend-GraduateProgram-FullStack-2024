import { apiClient } from "@/shared/api/apiClient";

import type { Comment, UpdateCommentInput } from "../types/comments";

export async function updateComment(id: string | number, input: UpdateCommentInput): Promise<Comment> {
  const res = await apiClient.put(`/api/comments/${id}`, { data: input });
  return res.data;
}

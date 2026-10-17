import { apiClient } from "@/shared/api/apiClient";

import type { Comment, CreateCommentInput } from "../types/comments";

export async function createComment(input: CreateCommentInput): Promise<Comment> {
  const res = await apiClient.post("/api/comments", { data: input });
  return res.data;
}

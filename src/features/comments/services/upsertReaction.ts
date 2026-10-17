import { apiClient } from "@/shared/api/apiClient";

export async function upsertReaction(commentId: string | number): Promise<void> {
  await apiClient.post("/api/reactions/upsert", {
    data: { comment: commentId, type: "heart" }
  });
}

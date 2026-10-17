import { apiClient } from "@/shared/api/apiClient";

export async function deleteComment(id: string | number): Promise<void> {
  await apiClient.delete(`/api/comments/${id}`);
}

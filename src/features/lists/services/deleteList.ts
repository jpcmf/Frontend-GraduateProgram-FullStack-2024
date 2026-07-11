import { apiClient } from "@/shared/api/apiClient";

export async function deleteList(id: string | number): Promise<void> {
  await apiClient.delete(`/api/user-lists/${id}`);
}

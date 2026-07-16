import { apiClient } from "@/shared/api/apiClient";

export async function deleteListItem(id: string | number): Promise<void> {
  await apiClient.delete(`/api/user-list-items/${id}`);
}

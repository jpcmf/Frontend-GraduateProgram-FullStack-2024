import { apiClient } from "@/lib/apiClient";

export async function deleteSpot(id: string | number): Promise<void> {
  await apiClient.delete(`/api/spots/${id}`);
}

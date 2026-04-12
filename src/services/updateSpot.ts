import { apiClient } from "@/lib/apiClient";
import type { SpotResponse, UpdateSpotPayload } from "@/types/spots";

export async function updateSpot(id: string | number, payload: UpdateSpotPayload): Promise<SpotResponse> {
  const res = await apiClient.put(`/api/spots/${id}`, { data: payload });
  return res.data;
}

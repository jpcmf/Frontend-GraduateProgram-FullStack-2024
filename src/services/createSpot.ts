import { apiClient } from "@/lib/apiClient";
import type { CreateSpotPayload, SpotResponse } from "@/types/spots";

export async function createSpot(payload: CreateSpotPayload): Promise<SpotResponse> {
  const res = await apiClient.post("/api/spots", { data: payload });
  return res.data;
}

import { apiClient } from "@/lib/apiClient";
import type { SpotResponse } from "@/types/spots";

const POPULATE =
  "?populate[photos]=true" +
  "&populate[created_by_user][fields][0]=username" +
  "&populate[created_by_user][fields][1]=name";

export async function getSpotById(id: string | number): Promise<SpotResponse> {
  const res = await apiClient.get(`/api/spots/${id}${POPULATE}`);
  return res.data;
}

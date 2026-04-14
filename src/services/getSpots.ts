import { apiClient } from "@/lib/apiClient";
import type { SpotsResponse } from "@/types/spots";

const POPULATE =
  "?populate[photos]=true" +
  "&populate[created_by_user][fields][0]=username" +
  "&populate[created_by_user][fields][1]=name";

export async function getSpots(): Promise<SpotsResponse> {
  const res = await apiClient.get(`/api/spots${POPULATE}`);
  return res.data;
}

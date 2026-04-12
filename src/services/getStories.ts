import { apiClient } from "@/lib/apiClient";
import type { StoriesResponse } from "@/types/stories";

export async function getStories(): Promise<StoriesResponse> {
  const res = await apiClient.get(
    "/api/stories" +
      "?populate[author][fields][0]=username" +
      "&populate[author][fields][1]=name" +
      "&populate[author][populate][avatar][fields][0]=url" +
      "&populate[author][populate][avatar][fields][1]=formats"
  );
  return res.data;
}

export async function getStoriesByUserId(userId: string): Promise<StoriesResponse> {
  const res = await apiClient.get(
    "/api/stories" +
      `?filters[author][id][$eq]=${userId}` +
      "&populate[author][fields][0]=username" +
      "&populate[author][fields][1]=name" +
      "&populate[author][populate][avatar][fields][0]=url" +
      "&populate[author][populate][avatar][fields][1]=formats"
  );
  return res.data;
}

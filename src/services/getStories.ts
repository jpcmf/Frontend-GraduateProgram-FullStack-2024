import { apiClient } from "@/lib/apiClient";
import type { StoriesResponse } from "@/types/stories";

// TODO: re-enable 24h filter before going to production
// function get24hISOThreshold(): string {
//   return new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
// }

export async function getStories(): Promise<StoriesResponse> {
  // const since = get24hISOThreshold();
  const res = await apiClient.get(
    "/api/stories" +
      // `?filters[createdAt][$gte]=${encodeURIComponent(since)}` +
      "?populate[author][fields][0]=username" +
      "&populate[author][fields][1]=name" +
      "&populate[author][populate][avatar][fields][0]=url" +
      "&populate[author][populate][avatar][fields][1]=formats"
  );
  return res.data;
}

export async function getStoriesByUserId(userId: string): Promise<StoriesResponse> {
  // const since = get24hISOThreshold();
  const res = await apiClient.get(
    "/api/stories" +
      `?filters[author][id][$eq]=${userId}` +
      // `&filters[createdAt][$gte]=${encodeURIComponent(since)}` +
      "&populate[author][fields][0]=username" +
      "&populate[author][fields][1]=name" +
      "&populate[author][populate][avatar][fields][0]=url" +
      "&populate[author][populate][avatar][fields][1]=formats"
  );
  return res.data;
}

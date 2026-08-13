import type { StoriesResponse } from "../types/stories";

const API = process.env.NEXT_PUBLIC_STRAPI_URL;

export async function getStoriesServer(): Promise<StoriesResponse> {
  const res = await fetch(
    `${API}/api/stories` +
      "?populate[author][fields][0]=username" +
      "&populate[author][fields][1]=name" +
      "&populate[author][populate][avatar][fields][0]=url" +
      "&populate[author][populate][avatar][fields][1]=formats",
    { next: { revalidate: 60 } }
  );

  if (!res.ok) {
    throw new Error(`Failed to fetch stories: ${res.status}`);
  }

  return res.json();
}
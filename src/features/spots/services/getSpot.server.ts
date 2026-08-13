import type { SpotResponse } from "../types/spots";

const POPULATE =
  "?populate[photos]=true" +
  "&populate[created_by_user][fields][0]=username" +
  "&populate[created_by_user][fields][1]=name";

const API = process.env.NEXT_PUBLIC_STRAPI_URL;

export async function getSpotServer(id: string | number): Promise<SpotResponse> {
  const res = await fetch(`${API}/api/spots/${id}${POPULATE}`, { next: { revalidate: 60 } });

  if (!res.ok) {
    throw new Error(`Failed to fetch spot ${id}: ${res.status}`);
  }

  return res.json();
}

import type { MetadataRoute } from "next";

import { getSpotsServer } from "@/features/spots";

const BASE_URL = "https://skatehub.vercel.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const spots = await getSpotsServer();

  const spotEntries: MetadataRoute.Sitemap = spots.data.map(spot => ({
    url: `${BASE_URL}/spots/${spot.id}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.7
  }));

  return [
    { url: `${BASE_URL}/`, lastModified: new Date(), changeFrequency: "monthly", priority: 1 },
    { url: `${BASE_URL}/spots`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/skatistas`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    ...spotEntries
  ];
}
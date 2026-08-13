import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getSpotServer, SpotDetail } from "@/features/spots";

type SpotDetailPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: SpotDetailPageProps): Promise<Metadata> {
  const { id } = await params;

  try {
    const response = await getSpotServer(id);
    const spot = response.data;
    const description = (spot.attributes.description ?? "").slice(0, 160);

    return {
      title: `${spot.attributes.name} — SkateHub`,
      description,
      alternates: { canonical: `https://skatehub.vercel.app/spots/${id}` },
      openGraph: {
        title: `${spot.attributes.name} — SkateHub`,
        description,
        url: `https://skatehub.vercel.app/spots/${id}`,
        type: "website"
      },
      twitter: {
        card: "summary",
        title: `${spot.attributes.name} — SkateHub`,
        description
      }
    };
  } catch {
    return {
      title: "Spot — SkateHub",
      description: "Spot de skate compartilhado pela comunidade SkateHub"
    };
  }
}

export default async function SpotDetailPage({ params }: SpotDetailPageProps) {
  const { id } = await params;

  let spot;
  try {
    const response = await getSpotServer(id);
    spot = response.data;
  } catch {
    notFound();
  }

  return <SpotDetail spot={spot} />;
}
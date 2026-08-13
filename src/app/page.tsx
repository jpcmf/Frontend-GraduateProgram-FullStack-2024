import type { Metadata } from "next";

import { Box } from "@chakra-ui/react";

import { SkatistasHome } from "@/features/skatistas";
import { getStoriesServer, StoriesHome } from "@/features/stories";
import { getSkatistasServer } from "@/features/skatistas";

export const metadata: Metadata = {
  title: "SkateHub",
  description: "Plataforma social para a comunidade do skate",
  alternates: { canonical: "https://skatehub.vercel.app/" },
  openGraph: {
    title: "SkateHub",
    description: "Plataforma social para a comunidade do skate",
    url: "https://skatehub.vercel.app/",
    type: "website"
  },
  twitter: {
    card: "summary",
    title: "SkateHub",
    description: "Plataforma social para a comunidade do skate"
  }
};

export default async function HomePage() {
  const [stories, skatistas] = await Promise.all([
    getStoriesServer(),
    getSkatistasServer(1, 10)
  ]);

  return (
    <Box>
      <StoriesHome initialStories={stories} />
      <SkatistasHome initialUsers={skatistas.users} initialTotalUsers={skatistas.totalFetchedUsers} />
    </Box>
  );
}
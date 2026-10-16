import type { Metadata } from "next";

import { Flex } from "@chakra-ui/react";

import { RecentCommentsFeed } from "@/features/comments";
import { getSkatistasServer, SkatistasHome } from "@/features/skatistas";
import { getStoriesServer, StoriesHome } from "@/features/stories";
import { Communities } from "@/shared/ui/New/Communities";
import { Composer } from "@/shared/ui/New/Composer";

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
  const [stories, skatistas] = await Promise.all([getStoriesServer(), getSkatistasServer(1, 10)]);

  return (
    <>
      <Flex direction={{ base: "column", lg: "row" }} gap={{ base: 5, lg: 4 }} align="flex-start">
        {/* Left column */}
        <Flex direction="column" flex={{ lg: "2" }} w="full" gap={5}>
          <StoriesHome initialStories={stories} />
          <Composer />
          <RecentCommentsFeed />
        </Flex>

        {/* Right column */}
        <Flex flex={{ lg: "1.5" }} w="full" direction="column" gap={5}>
          <SkatistasHome initialUsers={skatistas.users} initialTotalUsers={skatistas.totalFetchedUsers} />
          <Communities />
        </Flex>
      </Flex>
    </>
  );
}

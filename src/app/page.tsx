"use client";

import { Flex } from "@chakra-ui/react";

import { RecentCommentsFeed } from "@/features/comments";
import { SkatistasHome } from "@/features/skatistas/Home";
import { StoriesHome } from "@/features/stories";
import { Communities } from "@/shared/ui/New/Communities";
import { Composer } from "@/shared/ui/New/Composer";

export default function HomePage() {
  return (
    <>
      <Flex direction={{ base: "column", lg: "row" }} gap={{ base: 5, lg: 4 }} align="flex-start">
        {/* Left column */}
        <Flex direction="column" flex={{ lg: "2" }} w="full" gap={5}>
          <StoriesHome />
          <Composer />
          <RecentCommentsFeed />
        </Flex>

        {/* Right column */}
        <Flex flex={{ lg: "1.5" }} w="full" direction="column" gap={5}>
          <SkatistasHome />
          <Communities />
        </Flex>
      </Flex>
    </>
  );
}

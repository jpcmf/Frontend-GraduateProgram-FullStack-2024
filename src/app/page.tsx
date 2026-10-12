"use client";

import { Box, Flex } from "@chakra-ui/react";

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
        <Box flex={{ lg: "2" }} w="full">
          <StoriesHome />
          <Composer />
          <RecentCommentsFeed />
        </Box>

        {/* Right column */}
        <Box flex={{ lg: "1.5" }} w="full">
          <SkatistasHome />
          <Communities />
        </Box>
      </Flex>
    </>
  );
}

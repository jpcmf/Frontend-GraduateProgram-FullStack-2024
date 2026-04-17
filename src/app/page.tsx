"use client";

import { Box } from "@chakra-ui/react";

import { SkatistasHome } from "@/features/skatistas/home";
import { StoriesHome } from "@/features/stories/home";

export default function HomePage() {
  return (
    <Box>
      <StoriesHome />
      <SkatistasHome />
    </Box>
  );
}

"use client";

import { Box } from "@chakra-ui/react";

import { SkatistasHome } from "@/features/skatistas/Home";
import { StoriesHome } from "@/features/stories";

export default function HomePage() {
  return (
    <Box>
      <StoriesHome />
      <SkatistasHome />
    </Box>
  );
}

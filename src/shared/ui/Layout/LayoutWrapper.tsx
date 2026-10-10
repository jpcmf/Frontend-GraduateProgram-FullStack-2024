"use client";

import { usePathname } from "next/navigation";

import { Box, Grid, Stack } from "@chakra-ui/react";

import { Footer } from "@/shared/ui/New/Footer";
import { Header } from "@/shared/ui/New/Header";
import { LeftSidebar } from "@/shared/ui/New/Sidebar";

type LayoutProps = {
  children: React.ReactNode;
};

export function Layout({ children }: LayoutProps) {
  const pathname = usePathname();
  const isAIRoute = pathname === "/ai";

  return (
    <Box minH="100dvh" display="flex" flexDirection="column">
      <Header />
      <Box flex="1" w="full" maxW="1780px" mx="auto" px={{ base: 4, lg: 8 }} py={6}>
        <Grid alignItems="start" gap={6} templateColumns={{ base: "1fr", lg: "220px minmax(0, 1fr)" }}>
          <LeftSidebar />
          <Stack spacing={5} as="main">
            {children}
          </Stack>
        </Grid>
      </Box>
      {!isAIRoute && <Footer />}
    </Box>
  );
}

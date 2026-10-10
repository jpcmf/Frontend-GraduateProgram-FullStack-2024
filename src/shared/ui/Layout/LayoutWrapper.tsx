"use client";

import { usePathname } from "next/navigation";

import { Box, Flex, Grid, Stack, useColorMode } from "@chakra-ui/react";

import { Footer } from "@/shared/ui/Layout/Footer";
import { Header } from "@/shared/ui/Layout/Header";
import { Sidebar } from "@/shared/ui/Layout/Sidebar";
import { Footer as NewFooter } from "@/shared/ui/New/Footer";
import { Header as NewHeader } from "@/shared/ui/New/Header";
import { LeftSidebar } from "@/shared/ui/New/Sidebar";

type LayoutProps = {
  children: React.ReactNode;
};

export function Layout({ children }: LayoutProps) {
  const { colorMode } = useColorMode();
  const pathname = usePathname();
  const isAIRoute = pathname === "/ai";
  return (
    <>
      <svg
        width="100%"
        height="100%"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          background: `linear-gradient(to bottom, ${colorMode === "light" ? "#fff" : "#323238"}, #262829)`,
          position: "absolute",
          top: 0,
          left: 0,
          zIndex: -1,
          opacity: 0.1
        }}
      >
        <defs>
          <pattern id="smallSquares" width="20" height="20" patternUnits="userSpaceOnUse">
            <rect x="5" y="5" width="2" height="2" fill="white" fillOpacity="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#smallSquares)" />
      </svg>
      <Flex direction="column" minH="100dvh">
        <Header />
        <Flex flex={1}>
          <Sidebar />
          <Flex w="100%" direction="column" mt="0" px={{ base: 6, lg: 0 }}>
            <Flex flex={1} direction="column" mt={8} mx={{ base: 0, lg: 8 }}>
              {children}
            </Flex>
            {!isAIRoute && <Footer />}
          </Flex>
        </Flex>
      </Flex>
      {/* New Layout */}
      <Box minH="100vh" display="flex" flexDirection="column">
        <NewHeader />

        <Box flex="1" w="full" maxW="1780px" mx="auto" px={{ base: 4, lg: 8 }} py={6}>
          <Grid
            alignItems="start"
            gap={6}
            templateColumns={{
              base: "1fr",
              lg: "220px minmax(0, 1fr)"
              // xl: "220px minmax(0, 1.5fr) minmax(0, 1fr)"
            }}
          >
            <LeftSidebar />

            <Stack spacing={5} as="main">
              {children}
              {/* <div>1 </div>
              <div>1 </div> */}
            </Stack>

            {/* <Stack spacing={4} as="aside" gridColumn={{ lg: '1 / -1', xl: 'auto' }}>
              <div>1 </div>
              <div>1 </div>
              <div>1 </div>
              <div>1 </div>
              <div>1 </div>
            </Stack> */}
          </Grid>
        </Box>
        {!isAIRoute && <NewFooter />}
      </Box>
    </>
  );
}

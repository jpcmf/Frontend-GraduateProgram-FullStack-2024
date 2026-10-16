"use client";

import { usePathname } from "next/navigation";

import { Box, Flex, Stack } from "@chakra-ui/react";

import { Sidebar } from "@/shared/ui/Layout/Sidebar";
import { Footer } from "@/shared/ui/New/Footer";
import { Header } from "@/shared/ui/New/Header";

type LayoutProps = {
  children: React.ReactNode;
};

export function Layout({ children }: LayoutProps) {
  const pathname = usePathname();
  const isAIRoute = pathname === "/ai";

  return (
    <Flex minH="100dvh" direction="column">
      <Header />
      <Flex flex={1} w="full">
        <Sidebar />
        <Box flex={1} w="full" px={{ base: 4, lg: 8 }} py={6}>
          <Stack spacing={5} as="main" maxW="1780px" mx="auto">
            {children}
          </Stack>
        </Box>
      </Flex>
      {!isAIRoute && <Footer />}
    </Flex>
  );
}

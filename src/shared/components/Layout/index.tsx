"use client";

import { Flex, useColorMode } from "@chakra-ui/react";

import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";

type LayoutProps = {
  children: React.ReactNode;
};

export function Layout({ children }: LayoutProps) {
  const { colorMode } = useColorMode();
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
            <Footer />
          </Flex>
        </Flex>
      </Flex>
    </>
  );
}

import { Flex } from "@chakra-ui/react";

import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";

type LayoutProps = {
  children: React.ReactNode;
};

export function Layout({ children }: LayoutProps) {
  return (
    <>
      <Header />
      <Flex direction="row" flex={1}>
        <Sidebar />
        <Flex w="100%" direction="column" mt="0" maxWidth={1144} mx="" px={{ base: 6, lg: 0 }}>
          {children}
        </Flex>
      </Flex>
      <Footer />
    </>
  );
}

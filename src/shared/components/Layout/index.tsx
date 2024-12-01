import { Flex } from "@chakra-ui/react";
import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";

type LayoutProps = {
  children: React.ReactNode;
};

export function Layout({ children }: LayoutProps) {
  return (
    <Flex direction="column" h="100vh">
      <Header />
      <Flex w="100%" my="6" maxWidth={1480} mx="auto" px="6">
        <Sidebar />
        {children}
      </Flex>
    </Flex>
  );
}

import { useContext } from "react";
import { parseCookies } from "nookies";
import { Box, Flex, SimpleGrid, Text } from "@chakra-ui/react";

import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { AuthContext } from "@/contexts/AuthContext";

export default function Dashboard() {
  const { user } = useContext(AuthContext);

  return (
    <>
      <Flex direction="column" h="100vh">
        <Header />
        <Flex w="100%" my="6" maxWidth={1480} mx="auto" px="6">
          <Sidebar />
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={{ base: 5, lg: 8 }} w="100dvw">
            <Box p={["6", "8"]} bg="gray.800" borderRadius={8} flex="50%">
              <Text fontSize="lg" fontWeight="bold" mb="4">
                Status do cadastro do atleta
              </Text>
              <Text color="green.400">{user?.name}</Text>
              <Text color="green.400">Regular</Text>
            </Box>

            <Box p={["6", "8"]} bg="gray.800" borderRadius={8} flex="50%">
              <Text fontSize="lg" fontWeight="bold" mb="4">
                Dados de acesso da semana
              </Text>
              {user?.name} <br />
              {user?.about} <br />
            </Box>

            <Box p={["6", "8"]} bg="gray.800" borderRadius={8} flex="50%">
              <Text fontSize="lg" fontWeight="bold" mb="4">
                Documentações
              </Text>
              <Text color="green.400" as="a" href="#" textDecoration={"underline"}>
                Instruções para inscrição em eventos
              </Text>
            </Box>

            <Box p={["6", "8"]} bg="gray.800" borderRadius={8} flex="50%">
              <Text fontSize="lg" fontWeight="bold" mb="4">
                Taxa de abertura
              </Text>
            </Box>
          </SimpleGrid>
        </Flex>
      </Flex>
    </>
  );
}

export const getServerSideProps = async (ctx: any) => {
  const { ["nextauth.token"]: token } = parseCookies(ctx);

  if (!token) {
    return {
      redirect: {
        destination: "/",
        permanent: false
      }
    };
  }
  return {
    props: {}
  };
};

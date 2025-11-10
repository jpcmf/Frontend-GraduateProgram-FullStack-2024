import { Box, SimpleGrid, Text } from "@chakra-ui/react";

type DashboardProps = {
  user: any;
};

export function Dashboard({ user }: DashboardProps) {
  return (
    <SimpleGrid m={0} columns={{ base: 1, md: 3 }} spacing={{ base: 5, lg: 4 }} w="">
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
  );
}

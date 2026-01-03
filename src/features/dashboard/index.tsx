import {
  RiAccountBoxLine,
  RiBookOpenLine,
  RiCircleFill,
  RiMapPin2Line,
  RiThumbDownLine,
  RiThumbUpLine,
  RiUploadFill
} from "react-icons/ri";
import Link from "next/link";

import { Box, Heading, HStack, Icon, SimpleGrid, Text, useColorModeValue, VStack } from "@chakra-ui/react";

import { TitleSection } from "@/components/TitleSection";
import type { User } from "@/types/User.type";
import { formatSmartDate } from "@/utils/date";

type DashboardProps = {
  user: User;
};

export function Dashboard({ user }: DashboardProps) {
  const borderColor = useColorModeValue("green.200", "green.800");
  const textColor = useColorModeValue("gray.600", "gray.300");
  const bgColor = useColorModeValue("blackAlpha.100", "gray.800");
  const buttonBgColor = useColorModeValue("green.200", "green.800");
  const hoverBgColor = useColorModeValue("green.200", "green.400");
  return (
    <>
      <SimpleGrid mb={6} columns={{ base: 1, md: 4 }} spacing={{ base: 5, lg: 4 }}>
        <Box
          as={Link}
          href="/"
          p={["6", "8"]}
          bg={buttonBgColor}
          borderWidth={2}
          borderColor={borderColor}
          borderRadius={8}
          alignItems="center"
          justifyContent="center"
          display="flex"
          flexDirection="column"
          _hover={{ textDecoration: "none", bg: hoverBgColor }}
        >
          <Icon as={RiBookOpenLine} boxSize={8} mb={4} />
          <Heading size="md" mb={4}>
            Criar um story
          </Heading>
        </Box>
        <Box
          as={Link}
          href="/"
          p={["6", "8"]}
          bg={buttonBgColor}
          borderWidth={2}
          borderColor={borderColor}
          borderRadius={8}
          alignItems="center"
          justifyContent="center"
          textAlign="center"
          display="flex"
          flexDirection="column"
          _hover={{ textDecoration: "none", bg: hoverBgColor }}
        >
          <Icon as={RiMapPin2Line} boxSize={8} mb={4} />
          <Heading size="md" mb={4}>
            Criar um spot
          </Heading>
        </Box>
        <Box
          as={Link}
          href="/"
          p={["6", "8"]}
          bg={buttonBgColor}
          borderWidth={2}
          borderColor={borderColor}
          borderRadius={8}
          alignItems="center"
          justifyContent="center"
          textAlign="center"
          display="flex"
          flexDirection="column"
          _hover={{ textDecoration: "none", bg: hoverBgColor }}
        >
          <Icon as={RiBookOpenLine} boxSize={8} mb={4} />
          <Heading size="md" mb={4}>
            Criar um story
          </Heading>
        </Box>
        <Box
          as={Link}
          href="/user/edit"
          p={["6", "8"]}
          bg={buttonBgColor}
          borderWidth={2}
          borderColor={borderColor}
          borderRadius={8}
          alignItems="center"
          justifyContent="center"
          textAlign="center"
          display="flex"
          flexDirection="column"
          _hover={{ textDecoration: "none", bg: hoverBgColor }}
        >
          <Icon as={RiAccountBoxLine} boxSize={8} mb={4} />
          <Heading size="md" mb={4}>
            Editar meu perfil
          </Heading>
        </Box>
      </SimpleGrid>

      <TitleSection title="Visão geral" size="md" />

      <SimpleGrid m={0} columns={{ base: 1, md: 3 }} spacing={{ base: 5, lg: 4 }}>
        <Box p={["6", "8"]} bg={bgColor} borderRadius={8} flex="50%">
          <VStack align="flex-start" spacing={4}>
            <Text fontSize="lg" fontWeight="bold" mb="1">
              Status do cadastro do atleta
            </Text>
            <HStack>
              {user.confirmed ? (
                <>
                  <Icon as={RiThumbUpLine} boxSize={5} color="green.400" />
                  <Text fontSize="md">
                    Regular
                  </Text>
                </>
              ) : (
                <>
                  <Text fontSize="x-large" color="red.400">
                    Irregular
                  </Text>
                  <Icon as={RiThumbDownLine} boxSize={5} color="red.400" />
                </>
              )}
            </HStack>
            <Text fontSize="lg" fontWeight="bold" mb="1">
              Status da conta
            </Text>
            <HStack>
              <Icon as={RiCircleFill} boxSize={5} color={user.blocked ? "red.400" : "green.400"} />
              <Text fontSize="md">
                {user.blocked ? "Bloqueada" : "Ativa"}
              </Text>
            </HStack>
            <Text fontSize="lg" fontWeight="bold" mb="1">
              Dados de acesso da semana
            </Text>
            <HStack>
              <Icon as={RiUploadFill} boxSize={5} color={user.blocked ? "red.400" : "green.400"} />
              <Text fontSize="md">
                Última atualização: {formatSmartDate(user?.updatedAt || "...")}
              </Text>
            </HStack>
          </VStack>
        </Box>

        <Box p={["6", "8"]} bg={bgColor} borderRadius={8} flex="50%">
          <Text fontSize="lg" fontWeight="bold" mb="4">
            Documentações
          </Text>
          <Text color="green.400" as="a" href="#" textDecoration={"underline"}>
            Instruções para inscrição em eventos
          </Text>
        </Box>

        <Box p={["6", "8"]} bg={bgColor} borderRadius={8} flex="50%">
          <Text fontSize="lg" fontWeight="bold" mb="4">
            Taxa de abertura
          </Text>
        </Box>
      </SimpleGrid>
    </>
  );
}

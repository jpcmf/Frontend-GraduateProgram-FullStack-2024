import {
  RiAccountBoxLine,
  RiCircleFill,
  RiListCheck2,
  RiMapPin2Line,
  RiThumbDownLine,
  RiThumbUpLine,
  RiUploadFill,
  RiVideoAddLine
} from "react-icons/ri";
import Link from "next/link";

import { Box, Heading, HStack, Icon, SimpleGrid, Text, useColorModeValue, VStack } from "@chakra-ui/react";

import type { User } from "@/features/user";
import { useColors } from "@/shared/hooks/useColors";
import { formatSmartDate } from "@/shared/lib/date";
import { Panel } from "@/shared/ui/New/Panel";
import { TitleSection } from "@/shared/ui/TitleSection";

type DashboardProps = {
  user: User;
};

export function Dashboard({ user }: DashboardProps) {
  const { textSecondary } = useColors();
  const headingBgColor = useColorModeValue("white", "gray.800");
  return (
    <>
      <SimpleGrid mb={6} columns={{ base: 1, md: 4 }} spacing={{ base: 5, lg: 4 }}>
        <Panel _hover={{ transform: "translateY(-2px)", transition: "transform 0.2s", opacity: 0.9 }}>
          <Box
            as={Link}
            href="/"
            alignItems="center"
            justifyContent="center"
            textAlign="center"
            display="flex"
            flexDirection="column"
          >
            <Icon as={RiVideoAddLine} boxSize={8} mb={4} />
            <Heading size="sm" mb={2} bg={headingBgColor} borderRadius="full" px={4} py={1}>
              Criar Story
            </Heading>
            <Text fontSize="small" color={textSecondary}>
              Compartilhe momentos e sessões do seu dia no skate.
            </Text>
          </Box>
        </Panel>
        <Panel _hover={{ transform: "translateY(-2px)", transition: "transform 0.2s", opacity: 0.9 }}>
          <Box
            as={Link}
            href="/spots/new"
            alignItems="center"
            justifyContent="center"
            textAlign="center"
            display="flex"
            flexDirection="column"
          >
            <Icon as={RiMapPin2Line} boxSize={8} mb={4} />
            <Heading size="sm" mb={2} bg={headingBgColor} borderRadius="full" px={4} py={1}>
              Criar Spot
            </Heading>
            <Text fontSize="small" color={textSecondary}>
              Adicione e compartilhe picos para andar de skate.
            </Text>
          </Box>
        </Panel>
        <Panel _hover={{ transform: "translateY(-2px)", transition: "transform 0.2s", opacity: 0.9 }}>
          <Box
            as={Link}
            href="/lists/new"
            alignItems="center"
            justifyContent="center"
            textAlign="center"
            display="flex"
            flexDirection="column"
          >
            <Icon as={RiListCheck2} boxSize={8} mb={4} />
            <Heading size="sm" mb={2} bg={headingBgColor} borderRadius="full" px={4} py={1}>
              Criar Coleção
            </Heading>
            <Text fontSize="small" color={textSecondary}>
              Organize e compartilhe coleções do universo do skate.
            </Text>
          </Box>
        </Panel>
        <Panel _hover={{ transform: "translateY(-2px)", transition: "transform 0.2s", opacity: 0.9 }}>
          <Box
            as={Link}
            href="/user/edit"
            alignItems="center"
            justifyContent="center"
            textAlign="center"
            display="flex"
            flexDirection="column"
          >
            <Icon as={RiAccountBoxLine} boxSize={8} mb={4} />
            <Heading size="sm" mb={2} bg={headingBgColor} borderRadius="full" px={4} py={1}>
              Editar Perfil
            </Heading>
            <Text fontSize="small" color={textSecondary}>
              Atualize suas informações e destaque sua trajetória.
            </Text>
          </Box>
        </Panel>
        <Panel _hover={{ transform: "translateY(-2px)", transition: "transform 0.2s", opacity: 0.9 }}>
          <Box
            as={Link}
            href="/user/edit"
            alignItems="center"
            justifyContent="center"
            textAlign="center"
            display="flex"
            flexDirection="column"
            _hover={{ transform: "translateY(-2px)", transition: "transform 0.2s", opacity: 0.9 }}
          >
            <Icon as={RiAccountBoxLine} boxSize={8} mb={4} />
            <Heading size="sm" mb={2} bg={headingBgColor} borderRadius="full" px={4} py={1}>
              Editar Perfil
            </Heading>
            <Text fontSize="small" color={textSecondary}>
              Atualize suas informações e destaque sua trajetória.
            </Text>
          </Box>
        </Panel>
      </SimpleGrid>

      <TitleSection title="Visão geral" size="sm" />

      <SimpleGrid mb={6} columns={{ base: 1, md: 1 }} spacing={{ base: 5, lg: 4 }}>
        <Panel>
          <Box flex="100%">
            <HStack spacing={4} w="100%" justify="space-between">
              <VStack align="start" spacing={1}>
                <Text fontSize="sm" fontWeight="bold" mb="1">
                  Status da conta
                </Text>
                <HStack align="center" spacing={2}>
                  <Icon as={RiCircleFill} boxSize={4} color={user.blocked ? "red.400" : "green.400"} />
                  <Text fontSize="xs">{user.blocked ? "Bloqueada" : "Ativa"}</Text>
                </HStack>
              </VStack>
              <VStack align="start" spacing={1}>
                <Text fontSize="sm" fontWeight="bold" mb="1">
                  Status do cadastro do atleta
                </Text>
                {user.confirmed ? (
                  <HStack align="center" spacing={2}>
                    <Icon as={RiThumbUpLine} boxSize={4} color="green.400" />
                    <Text fontSize="xs">Regular</Text>
                  </HStack>
                ) : (
                  <HStack align="center" spacing={2}>
                    <Icon as={RiThumbDownLine} boxSize={3} color="red.400" />
                    <Text fontSize="xs">Irregular</Text>
                  </HStack>
                )}
              </VStack>
              <VStack align="start" spacing={1}>
                <Text fontSize="sm" fontWeight="bold" mb="1">
                  Dados de acesso
                </Text>
                <HStack align="center" spacing={2}>
                  <Icon as={RiUploadFill} boxSize={3} color="green.400" />
                  <Text fontSize="xs">Última atualização: {formatSmartDate(user?.updatedAt || "Indisponível")}</Text>
                </HStack>
              </VStack>
            </HStack>
          </Box>
        </Panel>

        {/* <Box p={["6", "8"]} bg={bgColor} borderRadius="lg" flex="100%">
          <Text fontSize="lg" fontWeight="bold" mb="4">
            Documentações
          </Text>
          <Text color="green.400" as="a" href="#" textDecoration={"underline"}>
            Instruções para inscrição em eventos
          </Text>
        </Box> */}
      </SimpleGrid>

      <TitleSection title="Atividades recentes" size="sm" />

      <SimpleGrid m={0} columns={{ base: 1 }} spacing={{ base: 5, lg: 4 }}>
        <Panel>
          <Box flex="50%">Hello World</Box>
        </Panel>
      </SimpleGrid>
    </>
  );
}

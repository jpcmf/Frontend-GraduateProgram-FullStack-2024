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

import { TitleSection } from "@/components/TitleSection";
import { useColors } from "@/hooks/useColors";
import type { User } from "@/types/User.type";
import { formatSmartDate } from "@/utils/date";

type DashboardProps = {
  user: User;
};

export function Dashboard({ user }: DashboardProps) {
  const { textSecondary, borderColor, bgColor } = useColors();
  const buttonBgColor = useColorModeValue("transparent", "transparent");
  const headingBgColor = useColorModeValue("white", "gray.800");
  return (
    <>
      <SimpleGrid mb={6} columns={{ base: 1, md: 4 }} spacing={{ base: 5, lg: 4 }}>
        <Box
          as={Link}
          href="/"
          p={["4", "6"]}
          bg={buttonBgColor}
          border="4px"
          borderColor={borderColor}
          borderRadius="lg"
          alignItems="center"
          justifyContent="center"
          textAlign="center"
          display="flex"
          flexDirection="column"
          _hover={{ transform: "translateY(-2px)", transition: "transform 0.2s", opacity: 0.9 }}
        >
          <Icon as={RiVideoAddLine} boxSize={8} mb={4} />
          <Heading size="sm" mb={2} bg={headingBgColor} borderRadius="full" px={4} py={1}>
            Criar Story
          </Heading>
          <Text fontSize="small" color={textSecondary}>
            Compartilhe momentos e sessões do seu dia no skate.
          </Text>
        </Box>
        <Box
          as={Link}
          href="/spots/new"
          p={["4", "6"]}
          bg={buttonBgColor}
          border="4px"
          borderColor={borderColor}
          borderRadius="lg"
          alignItems="center"
          justifyContent="center"
          textAlign="center"
          display="flex"
          flexDirection="column"
          _hover={{ transform: "translateY(-2px)", transition: "transform 0.2s", opacity: 0.9 }}
        >
          <Icon as={RiMapPin2Line} boxSize={8} mb={4} />
          <Heading size="sm" mb={2} bg={headingBgColor} borderRadius="full" px={4} py={1}>
            Criar Spot
          </Heading>
          <Text fontSize="small" color={textSecondary}>
            Adicione e compartilhe picos para andar de skate.
          </Text>
        </Box>
        <Box
          as={Link}
          href="/"
          p={["4", "6"]}
          bg={buttonBgColor}
          border="4px"
          borderColor={borderColor}
          borderRadius="lg"
          alignItems="center"
          justifyContent="center"
          textAlign="center"
          display="flex"
          flexDirection="column"
          _hover={{ transform: "translateY(-2px)", transition: "transform 0.2s", opacity: 0.9 }}
        >
          <Icon as={RiListCheck2} boxSize={8} mb={4} />
          <Heading size="sm" mb={2} bg={headingBgColor} borderRadius="full" px={4} py={1}>
            Criar Lista
          </Heading>
          <Text fontSize="small" color={textSecondary}>
            Organize e compartilhe coleções do universo do skate.
          </Text>
        </Box>
        <Box
          as={Link}
          href="/user/edit"
          p={["4", "6"]}
          bg={buttonBgColor}
          border="4px"
          borderColor={borderColor}
          borderRadius="lg"
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
      </SimpleGrid>

      <TitleSection title="Visão geral" size="md" />

      <SimpleGrid mb={6} columns={{ base: 1, md: 2 }} spacing={{ base: 5, lg: 4 }}>
        <Box p={["6", "8"]} bg={bgColor} borderRadius="lg" flex="50%">
          <VStack align="flex-start" spacing={4}>
            <Text fontSize="lg" fontWeight="bold" mb="1">
              Status do cadastro do atleta
            </Text>
            <HStack>
              {user.confirmed ? (
                <>
                  <Icon as={RiThumbUpLine} boxSize={5} color="green.400" />
                  <Text fontSize="md">Regular</Text>
                </>
              ) : (
                <>
                  <Icon as={RiThumbDownLine} boxSize={5} color="red.400" />
                  <Text fontSize="md">Irregular</Text>
                </>
              )}
            </HStack>
            <Text fontSize="lg" fontWeight="bold" mb="1">
              Status da conta
            </Text>
            <HStack>
              <Icon as={RiCircleFill} boxSize={5} color={user.blocked ? "red.400" : "green.400"} />
              <Text fontSize="md">{user.blocked ? "Bloqueada" : "Ativa"}</Text>
            </HStack>
            <Text fontSize="lg" fontWeight="bold" mb="1">
              Dados de acesso da semana
            </Text>
            <HStack>
              <Icon as={RiUploadFill} boxSize={5} color="green.400" />
              <Text fontSize="md">Última atualização: {formatSmartDate(user?.updatedAt || "Indisponível")}</Text>
            </HStack>
          </VStack>
        </Box>

        <Box p={["6", "8"]} bg={bgColor} borderRadius="lg" flex="50%">
          <Text fontSize="lg" fontWeight="bold" mb="4">
            Documentações
          </Text>
          <Text color="green.400" as="a" href="#" textDecoration={"underline"}>
            Instruções para inscrição em eventos
          </Text>
        </Box>
      </SimpleGrid>

      <TitleSection title="Atividades recentes" size="md" />

      <SimpleGrid m={0} columns={{ base: 1 }} spacing={{ base: 5, lg: 4 }}>
        <Box p={["6", "8"]} bg={bgColor} borderRadius="lg" flex="50%">
          Hello
        </Box>
      </SimpleGrid>
    </>
  );
}

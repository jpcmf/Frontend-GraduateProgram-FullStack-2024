import { RiEditLine } from "react-icons/ri";
import NextLink from "next/link";

import { Badge, Box, Button, Flex, Grid, GridItem, Image, Spinner, Text } from "@chakra-ui/react";

import { useListsByUser } from "@/features/lists";
import { useAuth } from "@/shared/hooks/useAuth";
import { useColors } from "@/shared/hooks/useColors";
import { ProfileHeader } from "@/shared/ui/HeaderProfile";
import { Muted } from "@/shared/ui/New/Muted";
import { Panel } from "@/shared/ui/New/Panel";
import { TitleSection } from "@/shared/ui/TitleSection";

import { useUser } from "../../hooks/useUser";

const TYPE_LABELS: Record<string, string> = {
  wish: "Desejo",
  like: "Curti",
  want: "Quero",
  recommend: "Recomendo"
};

const TYPE_COLORS: Record<string, string> = {
  wish: "purple",
  like: "green",
  want: "orange",
  recommend: "blue"
};

export function UserProfile({ userId }: { userId: string }) {
  const { user: currentUser } = useAuth();
  const { data: user, isLoading, error } = useUser(userId);
  const { data: listsResponse } = useListsByUser(userId);
  const userLists = listsResponse?.data || [];
  const { cardBg } = useColors();
  const isOwnProfile = String(currentUser?.id) === String(userId);

  const tricks = [
    {
      id: 1,
      title: "Mega Ramp Air",
      date: "2 days ago",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuDENOIOjB4kTUp2fOYb-X-zPgslq-gZO6Uf81DIhoE3lP1EMnB53KPGctYvfpGTrELBSVKyoO_bY8CnxpJFZSOqe812L8ICN2JZvXopdcA8Ya3E0Vo-nRKwiXrTbcvqdcBFITDnKqehutmwPPhMxBKXl4CjoY-ARhLoSyfdJN1Nyl8aCGRn9IwQ2-4Ia9hDpwtxW8wfcapkmM9Gf_WpXBIdb2WQ4Rdlzytqs8GtpwSyd15VsfTqmbspgL3hbaas6AmUz5UtBHPzlyNU"
    },
    {
      id: 2,
      title: "Downtown Handrail",
      date: "5 days ago",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuB2WDXJP9yIB6jwDdLaohTRMQP-0fWewkdDvl9N0hCvGm3kRjRKAwgSgufxo04G-6g3VVmHUVLTBTFTpmAHV8hyuvxQObBau0otnaJzvDmuavoRq6ed3RvdxidG2By8HhgHRshLjXuAowJSxX9VzX3KF4z0QHwugDMsnT2cJr37QAdxcaoNU0H3-wluUxDMqe8yMDs1x6poK90egOEUD2AjacCUeBMJnaGa1Ve3SDOwOxzXPtvy6sefPjTaHPzEW9ymbsmOLijNjAzP"
    },
    {
      id: 3,
      title: "Vert Ramp Session",
      date: "1 week ago",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuAP6JOPzvX8G1Brhrr3uby06DF7evmMyrDo9boFsXCN5vb--uJyu0I8iI-RFaycYeQhMXL_3nQ_OzXL66b5jEgRFilJ51c3IqUtaPSMQORCG_OfBTzaeiP-dBOi9ZzP3tK2fclPnPD6JBrYT3drTsSZZJYfx3oWtJPgcTYEpWvsd5Ih3QA1QdGK3mSvRw_3qQ7OafT6B181vZRUFnEpjpdvBBRQZ0407I_kEb87MBCFoLR92fb6y3AsOYwD4TQK2VdnE6AEZEuEcT1Q"
    }
  ];

  if (isLoading) {
    return (
      <Flex justify="center" align="center" minH="300px">
        <Spinner size="lg" color="green.400" />
      </Flex>
    );
  }

  if (error) {
    return <Text>Error: {error.message}</Text>;
  }

  if (!user) {
    return <Text>User not found.</Text>;
  }

  return (
    <>
      <ProfileHeader user={user} variant="profile" />
      <Flex minH="100vh" w="full" direction="column">
        <Grid templateColumns={{ base: "1fr", md: "repeat(5, 1fr)" }} gap={{ base: 0, md: 6 }} mb={6}>
          <GridItem colSpan={{ base: 1, md: 3 }}>
            {user.about && (
              <>
                <TitleSection title="Sobre" size="sm" />
                <Panel mb={6}>
                  <Text textAlign="left" lineHeight="tall" fontSize="sm">
                    {user?.about}
                  </Text>
                </Panel>
              </>
            )}
          </GridItem>
          <GridItem colSpan={{ base: 1, md: 2 }}>
            <Flex justify="space-between" align="start" mb={0}>
              <TitleSection title="Coleções" size="sm" />
              {isOwnProfile && (
                <Button leftIcon={<RiEditLine />} as={NextLink} href="/lists" colorScheme="green" size="xs">
                  Editar coleções
                </Button>
              )}
            </Flex>
            <Panel>
              <Box mb={0}>
                {userLists && userLists.length > 0 ? (
                  <>
                    <Grid templateColumns={{ base: "1fr", sm: "repeat(2, 1fr)", lg: "repeat(1, 1fr)" }} gap={4}>
                      {userLists.map(listItem => {
                        const list = listItem.attributes;
                        const itemCount = list.items?.data?.length ?? 0;
                        return (
                          <Box as={NextLink} href={`/lists/${listItem.id}`} key={listItem.id}>
                            <Badge colorScheme={TYPE_COLORS[list.type] || "gray"} px={2} borderRadius="full">
                              {TYPE_LABELS[list.type] || list.type}
                            </Badge>
                            <Text fontWeight="semibold" fontSize="sm" mt={2}>
                              {list.title}
                            </Text>
                            <Muted mt={0.5}>
                              {itemCount} {itemCount === 1 ? "item" : "itens"}
                            </Muted>
                          </Box>
                        );
                      })}
                    </Grid>
                  </>
                ) : (
                  <Text fontSize="sm">Nenhuma coleção encontrada.</Text>
                )}
              </Box>
            </Panel>
          </GridItem>
        </Grid>
        <Box flex={1}>
          <Box>
            <Box>
              <TitleSection title="Últimas" size="sm" />
              <Grid templateColumns={{ base: "1fr", sm: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }} gap={6}>
                {tricks.map(trick => (
                  <Panel key={trick.id} p={0} overflow="hidden">
                    <Image src={trick.image} alt={trick.title} w="full" h="160px" objectFit="cover" />
                    <Box p={4}>
                      <Text fontWeight="semibold" fontSize="sm">
                        {trick.title}
                      </Text>
                      <Muted mt={0.5}>{trick.date}</Muted>
                    </Box>
                  </Panel>
                ))}
              </Grid>
            </Box>
            {/* <Box bg={cardBg} borderRadius="lg" p={8}>
              <Flex direction={{ base: "column", md: "row" }} align={{ base: "center", md: "start" }} gap={8}>
                <Box position="relative" flexShrink={0}>
                  <Box bgGradient="linear(to-tr, green.100, purple.600)" borderRadius="full" p={0.5}>
                    <Link
                      display="block"
                      bg="gray.800"
                      borderRadius="full"
                      p={1}
                      transition="transform 0.2s"
                      _hover={{
                        transform: "rotate(-6deg)"
                      }}
                    >
                      <ChakraAvatar
                        size="2xl"
                        w="120px"
                        h="120px"
                        src={user?.avatar?.formats?.thumbnail?.url}
                        name={user?.name}
                        border="none"
                      />
                    </Link>
                  </Box>

                  <IconButton
                    aria-label="Online status"
                    position="absolute"
                    bottom={3}
                    right={2}
                    size="sm"
                    borderRadius="full"
                    color="gray.100"
                    bg="green.300"
                    border="2px solid"
                    borderColor="gray.800"
                    w={6}
                    h={6}
                    minW={6}
                    fontSize="lg"
                    _hover={{
                      bg: "green.300"
                    }}
                  />
                </Box>

                <VStack align={{ base: "center", md: "start" }} w="full" spacing={4}>
                  <HStack>
                    <Heading size="lg">{user?.name}</Heading>
                    {user?.category && (
                      <Badge colorScheme="green" px={3} py={1} borderRadius="full">
                        {user?.category?.name}
                      </Badge>
                    )}
                  </HStack>

                  <HStack>
                    <Icon as={FaMapMarkerAlt} />
                    <Text>
                      {user?.address?.city}, {user?.address?.uf}, {user?.address?.country}
                    </Text>
                  </HStack>

                  <HStack spacing={4}>
                    {user?.instagram_url && (
                      <Link as="button" onClick={() => openInstagram(user.instagram_url)} _hover={{ opacity: 0.8 }}>
                        <Icon as={FaInstagram} w={6} h={6} />
                      </Link>
                    )}
                    {user?.website_url && (
                      <Link as="button" onClick={() => openWebsite(user.website_url)} _hover={{ opacity: 0.8 }}>
                        <Icon as={FaGlobe} w={6} h={6} />
                      </Link>
                    )}
                  </HStack>

                  <Text textAlign={{ base: "center", md: "left" }}>{user?.about}</Text>
                </VStack>
              </Flex>
            </Box> */}
          </Box>
        </Box>
      </Flex>
    </>
  );
}

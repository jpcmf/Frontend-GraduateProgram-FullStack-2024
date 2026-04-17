import { Box, Flex, Grid, Heading, Image, Spinner, Text } from "@chakra-ui/react";

import { ProfileHeader } from "@/components/HeaderProfile";
import { TitleSection } from "@/components/TitleSection";
import { useColors } from "@/hooks/useColors";
import { useUser } from "@/hooks/useUser";

export function UserProfile({ userId }: { userId: string }) {
  const { data: user, isLoading, error } = useUser(userId);
  const { cardBg, textMuted } = useColors();

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
      <TitleSection title="Perfil" />
      <ProfileHeader user={user} variant="profile" />
      {user.about && (
        <Box bg={cardBg} borderRadius="lg" p={{ base: 4, md: 8 }} mb={6}>
          <Heading size="md" py={0} pr={4} mb={4}>
            Sobre
          </Heading>
          <Text textAlign="left" lineHeight="tall">
            {user?.about}
          </Text>
        </Box>
      )}
      <Flex minH="100vh">
        <Box flex={1}>
          <Box>
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

            <Box mt={8}>
              <TitleSection title="Últimas" size="md" />
              <Grid templateColumns={{ base: "1fr", sm: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }} gap={6}>
                {tricks.map(trick => (
                  <Box key={trick.id} bg={cardBg} borderRadius="lg" overflow="hidden">
                    <Image src={trick.image} alt={trick.title} w="full" h="160px" objectFit="cover" />
                    <Box p={4}>
                      <Text fontWeight="semibold">{trick.title}</Text>
                      <Text fontSize="sm" color={textMuted} mt={1}>
                        {trick.date}
                      </Text>
                    </Box>
                  </Box>
                ))}
              </Grid>
            </Box>
          </Box>
        </Box>
      </Flex>
    </>
  );
}

import { Avatar as ChakraAvatar, Box, Flex, HStack, Link, useColorModeValue, VStack } from "@chakra-ui/react";

export function StoriesSwiper() {
  const bgColor = useColorModeValue("white", "gray.900");
  const stories = [
    {
      id: 1,
      name: "You",
      image: "",
      isUser: false
    },
    {
      id: 2,
      name: "Bootsie",
      image: "",
      isUser: false
    },
    {
      id: 3,
      name: "Sketch",
      image: "",
      isUser: false
    },
    {
      id: 4,
      name: "Blam blam",
      image: "",
      isUser: true
    },
    {
      id: 5,
      name: "Whiskers",
      image: "",
      isUser: true
    },
    {
      id: 6,
      name: "You",
      image: "",
      isUser: true
    },
    {
      id: 7,
      name: "Bootsie",
      image: "",
      isUser: true
    },
    {
      id: 8,
      name: "Sketch",
      image: "",
      isUser: true
    },
    {
      id: 9,
      name: "Blam blam",
      image: "",
      isUser: true
    },
    {
      id: 10,
      name: "Whiskers",
      image: "",
      isUser: true
    },
    {
      id: 11,
      name: "Whiskers",
      image: "",
      isUser: true
    },
    {
      id: 12,
      name: "Whiskers",
      image: "",
      isUser: true
    },
    {
      id: 13,

      name: "Whiskers",
      image: "",
      isUser: true
    }
  ];

  // const handleAddStory = (name: string) => {
  //   alert(`Story for ${name}`);
  // };

  return (
    <Flex borderRadius="md" mb={6} overflow={"hidden"} maxW={1144} position="relative" h="134px">
      <HStack
        w="100%"
        position="absolute"
        top={0}
        left={0}
        spacing={6}
        overflowX="auto"
        overflowY="hidden"
        pb={4}
        css={{
          "&::-webkit-scrollbar": {
            height: "8px"
          },
          "&::-webkit-scrollbar-track": {
            background: "#f1f1f1",
            borderRadius: "10px"
          },
          "&::-webkit-scrollbar-thumb": {
            background: "#888",
            borderRadius: "10px"
          },
          "&::-webkit-scrollbar-thumb:hover": {
            background: "#555"
          }
        }}
      >
        {stories.map(story => (
          <VStack key={story.id} spacing={1} flexShrink={0}>
            <Box position="relative">
              <Box
                bgGradient={story.isUser ? "linear(to-tr, gray.800, gray.700)" : "linear(to-tr, green.100, purple.600)"}
                borderRadius="full"
                p={0.5}
              >
                <Link
                  display="block"
                  bg={bgColor}
                  borderRadius="full"
                  p={1}
                  transition="transform 0.2s"
                  _hover={{
                    transform: "rotate(-6deg)"
                  }}
                >
                  <ChakraAvatar
                    w="66px"
                    h="66px"
                    bgColor={story.isUser ? "gray.800" : "green.300"}
                    src={story?.image ? story.image : "https://robohash.org/" + story?.name}
                  />
                </Link>
              </Box>
            </Box>
            <Link
              mt={1}
              fontSize="sm"
              fontWeight="medium"
              color={story.isUser ? "gray.600" : "gray.100"}
              _hover={{
                color: story.isUser ? "gray.700" : "gray.600"
              }}
            >
              {story.name}
            </Link>
          </VStack>
        ))}
      </HStack>
    </Flex>
  );
}

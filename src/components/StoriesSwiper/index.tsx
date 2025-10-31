import { TbSkateboard } from "react-icons/tb";

import { Box, Flex, HStack, IconButton, Link, VStack } from "@chakra-ui/react";
import Avatar from "boring-avatars";

export function StoriesSwiper() {
  const stories = [
    {
      id: 1,
      name: "You",
      image: "https://placekitten.com/250/250",
      isUser: false
    },
    {
      id: 2,
      name: "Bootsie",
      image: "https://placekitten.com/200/200",
      isUser: false
    },
    {
      id: 3,
      name: "Sketch",
      image: "https://placekitten.com/300/300",
      isUser: false
    },
    {
      id: 4,
      name: "Blam blam",
      image: "https://placekitten.com/400/400",
      isUser: true
    },
    {
      id: 5,
      name: "Whiskers",
      image: "https://placekitten.com/350/350",
      isUser: true
    },
    {
      id: 6,
      name: "You",
      image: "https://placekitten.com/250/250",
      isUser: true
    },
    {
      id: 7,
      name: "Bootsie",
      image: "https://placekitten.com/200/200",
      isUser: true
    },
    {
      id: 8,
      name: "Sketch",
      image: "https://placekitten.com/300/300",
      isUser: true
    },
    {
      id: 9,
      name: "Blam blam",
      image: "https://placekitten.com/400/400",
      isUser: true
    },
    {
      id: 10,
      name: "Whiskers",
      image: "https://placekitten.com/350/350",
      isUser: true
    }
  ];

  const handleAddStory = (name: string) => {
    alert(`Story for ${name}`);
  };

  return (
    <Flex borderRadius="md" mb={6} overflow={"hidden"} maxW={1144} position="relative" h="164px">
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
                bgGradient={story.isUser ? "gray.800" : "linear(to-tr, green.100, purple.600)"}
                borderRadius="full"
                p={0.5}
              >
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
                  {/* <ChakraAvatar size="xl" src={story.image} name={story.name} border="none" /> */}
                  <Avatar name={story.name} variant="marble" size={96} />
                </Link>
              </Box>

              <IconButton
                icon={<TbSkateboard />}
                aria-label="Add story"
                position="absolute"
                bottom={0}
                right={1}
                size="sm"
                borderRadius="full"
                colorScheme="green"
                border="2px solid white"
                w={8}
                h={8}
                minW={8}
                fontSize="lg"
                onClick={() => handleAddStory(story.name)}
                _hover={{
                  bg: "green.700"
                }}
              />
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

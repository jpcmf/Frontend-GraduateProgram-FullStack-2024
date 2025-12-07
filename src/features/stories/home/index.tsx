import { Box, Divider, Flex, Heading, useColorModeValue } from "@chakra-ui/react";

import { StoriesSwiper } from "@/components/StoriesSwiper";
import { useStories } from "@/hooks/useStories";

export function StoriesHome() {
  const titleBgColor = useColorModeValue("white", "gray.900");
  const { data } = useStories();

  const stories2 =
    data?.data.map(story => ({
      id: story.id,
      storyAuthorId: story.attributes.author.data.id,
      name: story.attributes.author.data.attributes.username,
      image: "",
      isUserOffline: false //TODO: implement logic to determine if the user is offline
    })) || [];

  return (
    <>
      <Box mb={6}>
        <Flex direction="row" alignItems="center" position="relative">
          <Heading size="lg" fontWeight="semibold" bg={titleBgColor} py={0} pr={4}>
            Online agora
          </Heading>
          <Divider my="0" borderColor="gray.700" position="absolute" left={0} right={0} zIndex={-1} />
        </Flex>
      </Box>
      <StoriesSwiper stories={stories2} />
    </>
  );
}

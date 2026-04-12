import { Box, Flex, Spinner, Text } from "@chakra-ui/react";

import { StoriesSwiper } from "@/components/StoriesSwiper";
import { TitleSection } from "@/components/TitleSection";
import { useStories } from "@/hooks/useStories";

export function StoriesHome() {
  const { data, isLoading, isError } = useStories();

  const stories =
    data?.data?.map(story => ({
      id: story.id,
      storyAuthorId: story.attributes.author.data.id,
      name: story.attributes.author.data.attributes.name,
      image: "", // TODO: implement logic to fetch user image
      isUserOffline: false //TODO: implement logic to determine if the user is offline
    })) || [];

  if (isLoading) {
    return (
      <Flex justify="center" align="center" minH="139px">
        <Spinner size="lg" color="green.400" />
      </Flex>
    );
  }

  if (isError) {
    return (
      <Flex justify="center" align="center" minH="139px">
        <Text color="red.500">Erro ao carregar stories.</Text>
      </Flex>
    );
  }

  return (
    <>
      <Box mb={6}>
        <TitleSection title="Online agora" />
      </Box>
      <StoriesSwiper stories={stories} />
    </>
  );
}

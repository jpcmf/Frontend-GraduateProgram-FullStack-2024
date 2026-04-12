import { Box, Flex, Spinner, Text } from "@chakra-ui/react";

import { StoriesSwiper } from "@/components/StoriesSwiper";
import { TitleSection } from "@/components/TitleSection";
import { useStories } from "@/hooks/useStories";

export function StoriesHome() {
  const { data, isLoading, isError } = useStories();

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

  const stories = (data?.data ?? [])
    .filter(story => story.attributes.author?.data != null)
    .map(story => ({
      id: story.id,
      storyAuthorId: story.attributes.author.data.id,
      name: story.attributes.author.data.attributes.name,
      image:
        story.attributes.author.data.attributes.avatar?.data?.attributes?.formats?.thumbnail?.url ??
        story.attributes.author.data.attributes.avatar?.data?.attributes?.url ??
        "",
      isUserOffline: false //TODO: implement logic to determine if the user is offline
    }));

  if (stories.length === 0) {
    return (
      <Flex justify="center" align="center" minH="139px">
        <Text color="gray.500">Nenhum story nas últimas 24 horas.</Text>
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

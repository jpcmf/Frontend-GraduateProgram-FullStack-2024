"use client";

import { Flex, Spinner, Text } from "@chakra-ui/react";

import type { StoriesResponse } from "../../types/stories";
import { StoriesSwiper } from "@/shared/ui/StoriesSwiper";

import { useStories } from "../../hooks/useStories";

interface StoriesHomeProps {
  initialStories?: StoriesResponse;
}

export function StoriesHome({ initialStories }: StoriesHomeProps) {
  const { data, isLoading, isError } = useStories();

  const storiesResponse = data ?? initialStories;

  const stories = (storiesResponse?.data ?? [])
    .filter(
      (
        story
      ): story is typeof story & {
        attributes: { author: { data: NonNullable<typeof story.attributes.author.data> } };
      } => story.attributes.author?.data != null
    )
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
    if (isLoading && !initialStories) {
      return (
        <Flex justify="center" align="center" minH="139px">
          <Spinner size="lg" color="green.400" />
        </Flex>
      );
    }
    if (isError && !initialStories) {
      return (
        <Flex justify="center" align="center" minH="139px">
          <Text color="red.500">Erro ao carregar stories.</Text>
        </Flex>
      );
    }
    return (
      <Flex justify="center" align="center" minH="139px">
        <Text color="gray.500">Nenhum story nas últimas 24 horas.</Text>
      </Flex>
    );
  }

  return <StoriesSwiper stories={stories} />;
}
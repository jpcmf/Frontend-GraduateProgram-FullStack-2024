import Stories from "react-insta-stories";

import { Box, Center, Spinner, Text } from "@chakra-ui/react";

import { useStoriesByUserId } from "@/hooks/useStoriesByUserId";

interface StoryItem {
  id?: number;
  attributes: {
    url: string;
    duration: number;
    see_more_enabled?: boolean;
    see_more_text?: string | null;
    see_more_link?: string | null;
    createdAt?: string;
    updatedAt?: string;
  };
}

interface StoriesModalProps {
  userId: string;
  onClose: () => void;
  onAllStoriesEnd?: () => void;
}

export function StoriesModal({ userId, onClose, onAllStoriesEnd }: StoriesModalProps) {
  const { data, isLoading, isError, error } = useStoriesByUserId(userId);

  const stories = (() => {
    try {
      if (!data?.data || !Array.isArray(data.data)) {
        return [];
      }

      return data.data.map((story: StoryItem) => ({
        url: story.attributes.url,
        duration: story.attributes.duration || 5000,
        ...(story.attributes.see_more_enabled && {
          seeMore: ({ close }: { close: () => void }) => {
            return <div onClick={close}>Hello, click to close this.</div>;
          }
        })
      }));
    } catch (_err) {
      return [];
    }
  })();

  if (isLoading || !userId || stories.length === 0) {
    return (
      <Center bg="transparent">
        <Spinner size="lg" color="green.400" />
      </Center>
    );
  }

  if (isError) {
    return (
      <Center h="768px" flexDirection="column" gap={4}>
        <Text fontSize="2xl" fontWeight="bold">
          Erro ao carregar stories
        </Text>
        <Text color="text.secondary">{error?.message || "Tente novamente mais tarde"}</Text>
        <Box
          as="button"
          px={6}
          py={3}
          bg="green.400"
          color="white"
          borderRadius="md"
          fontWeight="semibold"
          onClick={onClose}
          _hover={{ bg: "green.500" }}
        >
          Fechar
        </Box>
      </Center>
    );
  }

  return (
    <Stories
      key={userId}
      stories={stories}
      defaultInterval={1500}
      width={432}
      height={768}
      onAllStoriesEnd={() => {
        if (onAllStoriesEnd) {
          onAllStoriesEnd();
        } else {
          onClose();
        }
      }}
      onStoryEnd={(_storyIndex: number) => {}}
    />
  );
}

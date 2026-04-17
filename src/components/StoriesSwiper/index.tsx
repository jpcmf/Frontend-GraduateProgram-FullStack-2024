"use client";

import { useMemo, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { Avatar as ChakraAvatar, Box, Flex, HStack, Link, useColorModeValue, VStack } from "@chakra-ui/react";

import { StoriesModal } from "@/features/stories/modal";

import { ReusableModal } from "../ReusableModal";

interface StoriesSwiperProps {
  stories: Array<{
    id: number;
    storyAuthorId: number;
    name: string;
    image: string;
    isUserOffline: boolean;
  }>;
}

export function StoriesSwiper({ stories }: StoriesSwiperProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const searchParams = useSearchParams();
  const bgColor = useColorModeValue("white", "gray.900");
  const textOfflineUser = useColorModeValue("gray.100", "gray.600");
  const textOnlineUser = useColorModeValue("gray.600", "gray.100");
  const textHoverUser = useColorModeValue("gray.100", "gray.600");
  const bgUserAvatar = useColorModeValue("gray.300", "gray.100");

  const isStoryModalOpen = searchParams?.get("modal") === "stories";
  const currentUserId = searchParams?.get("userId") as string;

  const uniqueStories = useMemo(() => {
    const seen = new Set<number>();
    return stories.filter(story => {
      if (seen.has(story.storyAuthorId)) {
        return false;
      }
      seen.add(story.storyAuthorId);
      return true;
    });
  }, [stories]);

  const handleViewStory = (story: (typeof stories)[number]) => {
    startTransition(() => {
      const params = new URLSearchParams(searchParams?.toString() || "");
      params.set("modal", "stories");
      params.set("userId", story.storyAuthorId.toString());
      router.push(`?${params.toString()}`);
    });
  };

  const currentIndex = uniqueStories.findIndex(s => s.storyAuthorId.toString() === currentUserId);

  const handleCloseModal = () => {
    startTransition(() => {
      const params = new URLSearchParams(searchParams?.toString() || "");
      params.delete("modal");
      params.delete("userId");
      const newSearch = params.toString();
      router.push(newSearch ? `?${newSearch}` : "/");
    });
  };

  const handleAdvanceToNextUser = () => {
    const nextStory = uniqueStories[currentIndex + 1];
    if (nextStory) {
      startTransition(() => {
        const params = new URLSearchParams(searchParams?.toString() || "");
        params.set("modal", "stories");
        params.set("userId", nextStory.storyAuthorId.toString());
        router.push(`?${params.toString()}`);
      });
    } else {
      handleCloseModal();
    }
  };

  return (
    <>
      <Flex borderRadius="md" mb={0} overflow={"hidden"} maxW={1144} position="relative" h="134px">
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
          {uniqueStories.map(story => (
            <VStack key={story.id} spacing={1} flexShrink={0}>
              <Box position="relative">
                <Box
                  bgGradient={
                    story.isUserOffline ? "linear(to-tr, gray.800, gray.700)" : "linear(to-tr, green.100, purple.600)"
                  }
                  borderRadius="full"
                  p={0.5}
                >
                  <Link
                    onClick={() => handleViewStory(story)}
                    display="block"
                    bg={bgColor}
                    borderRadius="full"
                    p={1}
                    transition="transform 0.2s"
                    _hover={{
                      transform: story?.isUserOffline ? "inherit" : "rotate(-6deg)"
                    }}
                  >
                    <ChakraAvatar
                      w="66px"
                      h="66px"
                      name={story.name}
                      bgColor={story.isUserOffline ? bgUserAvatar : "green.300"}
                      src={story?.image ? story.image : undefined}
                      style={{ filter: story.isUserOffline ? `grayscale(100%)` : "none" }}
                    />
                  </Link>
                </Box>
              </Box>
              <Link
                mt={1}
                fontSize="sm"
                fontWeight="medium"
                color={story.isUserOffline ? textOfflineUser : textOnlineUser}
                _hover={{
                  color: textHoverUser
                }}
              >
                {story.name}
              </Link>
            </VStack>
          ))}
        </HStack>
      </Flex>
      <ReusableModal isOpen={isStoryModalOpen} onClose={handleCloseModal} size="full">
        <StoriesModal userId={currentUserId} onClose={handleCloseModal} onAllStoriesEnd={handleAdvanceToNextUser} />
      </ReusableModal>
    </>
  );
}

import { useQuery } from "@tanstack/react-query";

import { getStoriesByUserId } from "@/services/getStories";

type StoryAttributes = {
  url: string;
  duration: number;
  see_more_enabled: boolean;
  see_more_text: string | null;
  see_more_link: string | null;
  createdAt: string;
  updatedAt: string;
  author: {
    data: {
      id: number;
      attributes: {
        username: string;
      };
    };
  };
};

type StoryItem = {
  id: number;
  attributes: StoryAttributes;
};

type StoriesResponseMeta = {
  pagination?: {
    page: number;
    pageSize: number;
    pageCount: number;
    total: number;
  };
  [key: string]: unknown;
};

type StoriesResponse = {
  data: StoryItem[];
  meta: StoriesResponseMeta;
};

export function useStoriesByUserId(userId: string) {
  return useQuery<StoriesResponse, Error>({
    queryKey: ["stories", userId],
    queryFn: () => {
      if (!userId) {
        throw new Error("User ID is required");
      }
      return getStoriesByUserId(userId);
    },
    enabled: !!userId, // only fetch when userId is defined
    staleTime: 1000 * 60 * 5, // consider data fresh for 5 minutes
    refetchOnWindowFocus: false
  });
}

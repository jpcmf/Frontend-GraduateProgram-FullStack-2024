import { useQuery } from "@tanstack/react-query";

import { getStories } from "@/services/getStories";

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

type StoryData = {
  id: number;
  attributes: StoryAttributes;
};

type UserBasicsWithStories = {
  data: StoryData[];
};

export function useStories() {
  return useQuery<UserBasicsWithStories, Error>({
    queryKey: ["stories"],
    queryFn: () => {
      return getStories();
    },
    staleTime: 1000 * 60 * 5, // consider data fresh for 5 minutes
    refetchOnWindowFocus: false
  });
}

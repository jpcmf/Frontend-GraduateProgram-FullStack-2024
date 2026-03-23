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
        name: string;
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

export type StoriesResponse = {
  data: StoryItem[];
  meta: StoriesResponseMeta;
};

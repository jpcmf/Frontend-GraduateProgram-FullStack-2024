export type UserBasics = {
  id: string;
  name: string;
  email: string;
  username: string;
  category: {
    id: number;
    name: string;
    value?: string;
  };
  about?: string;
  website_url?: string;
  instagram_url?: string;
  avatar: {
    url?: string;
    formats?: {
      thumbnail?: {
        url: string;
      };
    };
  };
  address: {
    country?: string;
    uf?: string;
    city?: string;
  };
  user_lists?: Array<{ id: number; title: string; type: string; items?: { data: Array<{ id: number }> } }>;
  blocked?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

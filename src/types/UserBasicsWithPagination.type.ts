export type UserBasicsWithPagination = {
  data: {
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
      format?: {
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
  }[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
};

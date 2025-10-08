export type UserBasics = {
  id: string;
  name: string;
  email: string;
  about?: string;
  username: string;
  website_url?: string;
  instagram_url?: string;
  avatar: {
    url?: string;
    formats: {
      thumbnail: {
        url?: string;
      };
    };
  };
  address: {
    country?: string;
    uf?: string;
    city?: string;
  };
};

export type UserBasicsWithPagination = {
  data: {
    id: string;
    name: string;
    email: string;
    about?: string;
    username: string;
    website_url?: string;
    instagram_url?: string;
    avatar: {
      url?: string;
      formats: {
        thumbnail: {
          url?: string;
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

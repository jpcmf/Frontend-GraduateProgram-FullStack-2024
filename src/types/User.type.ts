type Category = {
  id: number;
  name: string;
  value: string;
};

type Address = {
  country?: string;
  uf?: string;
  city?: string;
};

type Avatar = {
  url: string;
};

export type User = {
  id: string;
  name: string;
  email: string;
  username: string;
  category: Category;
  about: string;
  website_url: string;
  instagram_url: string;
  avatar: Avatar;
  address: Address;
  updatedAt?: string;
  blocked: boolean;
  confirmed: boolean;
};

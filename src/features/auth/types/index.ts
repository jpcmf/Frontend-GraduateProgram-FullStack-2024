export type SignInData = {
  email: string;
  password: string;
};

export type Category = {
  id: number;
  name: string;
  value?: string;
};

export type UpdateUserData = {
  id: string;
  name: string;
  email: string;
  username: string;
  category: Category;
  about: string;
  website_url?: string;
  instagram_url?: string;
};

export type SignInContextData = {
  email: string;
  password: string;
  recaptcha?: string;
};

export type UpdateUserContextData = {
  id: string;
  name: string;
  email: string;
  username: string;
  category: Category;
  about: string;
  website_url?: string;
  instagram_url?: string;
};

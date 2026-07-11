export type ListType = "wish" | "like" | "want" | "recommend";

export type ListItemAttributes = {
  name: string;
  description: string | null;
  external_url: string | null;
  image: { data: { id: number; attributes: { url: string; formats?: { thumbnail?: { url: string } } } } | null };
  createdAt: string;
  updatedAt: string;
};

export type ListItem = {
  id: number;
  attributes: ListItemAttributes;
};

export type ListAttr = {
  title: string;
  type: ListType;
  createdAt: string;
  updatedAt: string;
  owner?: { data: { id: number; attributes: { username: string; name: string; avatar?: { data: { attributes: { url: string } } | null } } } | null };
  items?: { data: ListItem[] };
};

export type List = {
  id: number;
  attributes: ListAttr;
};

export type ListsResponse = {
  data: List[];
  meta: { pagination: { page: number; pageSize: number; pageCount: number; total: number } };
};

export type ListResponse = {
  data: List;
};

export type CreateListPayload = {
  title: string;
  type: ListType;
};

export type UpdateListPayload = Partial<CreateListPayload>;

export type UpdateListItemPayload = {
  name?: string;
  description?: string;
  external_url?: string;
};

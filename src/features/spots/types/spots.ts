export type SpotType = "street" | "skatepark" | "diy" | "plaza" | "other";

export type SpotPhoto = {
  id: number;
  attributes: {
    url: string;
    width?: number;
    height?: number;
  };
};

export type SpotCreator = {
  data: {
    id: number;
    attributes: {
      username: string;
      name: string;
    };
  } | null;
};

export type SpotAttributes = {
  name: string;
  description: string | null;
  type: SpotType;
  address: string | null;
  photos: {
    data: SpotPhoto[] | null;
  };
  created_by_user: SpotCreator | undefined;
};

export type Spot = {
  id: number;
  attributes: SpotAttributes;
};

export type SpotsResponse = {
  data: Spot[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
};

export type SpotResponse = {
  data: Spot;
};

export type CreateSpotPayload = {
  name: string;
  description?: string;
  type: SpotType;
  address?: string;
  photos?: number[];
};

export type UpdateSpotPayload = Partial<CreateSpotPayload>;

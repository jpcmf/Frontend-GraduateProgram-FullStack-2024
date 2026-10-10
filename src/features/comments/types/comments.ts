export type CommentAuthorAvatar = {
  data: {
    id: number;
    attributes: {
      url: string;
      formats?: {
        thumbnail?: { url: string };
      };
    };
  } | null;
};

export type CommentAuthorCategory = {
  data: {
    id: number;
    attributes: {
      name: string;
    };
  } | null;
};

export type CommentAuthor = {
  data: {
    id: number;
    attributes: {
      username: string;
      name: string;
      avatar?: CommentAuthorAvatar;
      category?: CommentAuthorCategory;
    };
  } | null;
};

export type Reaction = {
  id: number;
  attributes: {
    type: "heart";
    user: {
      data: {
        id: number;
        attributes: {
          username: string;
          name: string;
        };
      } | null;
    };
  };
};

export type CommentSpot = {
  data: {
    id: number;
    attributes: {
      name: string;
    };
  } | null;
};

export type CommentImage = {
  id: number;
  attributes: {
    url: string;
    width?: number;
    height?: number;
    formats?: {
      thumbnail?: { url: string };
    };
  };
};

export type CommentAttributes = {
  text: string;
  links: unknown[];
  images: {
    data: CommentImage[] | null;
  };
  author?: CommentAuthor;
  spot?: CommentSpot;
  reactions: {
    data: Reaction[] | null;
  };
  flagged: boolean;
  flagged_reason: string | null;
  createdAt: string;
  updatedAt: string;
};

export type Comment = {
  id: number;
  attributes: CommentAttributes;
};

export type CommentsResponse = {
  data: Comment[];
  meta: {
    pagination: {
      total: number;
    };
  };
};

export type CreateCommentInput = {
  text: string;
  spot: number;
  images?: number[];
};

export type UpdateCommentInput = {
  text: string;
  images?: number[];
};

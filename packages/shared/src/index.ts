export type PostSummary = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  publishedAt: string | null;
};

export type AuthToken = {
  accessToken: string;
};



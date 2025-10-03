import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '@/store/store';

const baseUrl: string = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export type LoginInput = { email: string; password: string };
export type LoginResponse = { accessToken: string };

export type Post = {
  id: string;
  slug: string;
  title: string;
  content: string;
  summary: string | null;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type CreatePostInput = {
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  publishedAt?: string;
};

export type UpdatePostInput = Partial<CreatePostInput>;

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers, { getState }) => {
      const state = getState() as RootState;
      const token = state.auth.token || (typeof window !== 'undefined' ? JSON.parse(window.localStorage.getItem('auth') || 'null')?.token ?? null : null);
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
    // Add timeout to prevent hanging requests
    timeout: 10000, // 10 second timeout
  }),
  tagTypes: ['Post'],
  // Reduce refetch on focus/reconnect for better performance
  refetchOnMountOrArgChange: 60, // Only refetch if data is older than 60 seconds
  refetchOnFocus: false,
  refetchOnReconnect: true,
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginInput>({
      query: (body) => ({ url: '/auth/login', method: 'POST', body })
    }),
    getPublishedPosts: builder.query<Post[], void>({
      query: () => ({ url: '/posts' }),
      providesTags: ['Post'],
      keepUnusedDataFor: 600, // Cache for 10 minutes
      // Optimize: transform response to reduce re-renders
      transformResponse: (response: Post[]) => response,
    }),
    getPostBySlug: builder.query<Post, string>({
      query: (slug) => ({ url: `/posts/${slug}` }),
      providesTags: (result, error, slug) => [{ type: 'Post', id: slug }],
      keepUnusedDataFor: 600, // Increased cache time to 10 minutes
    }),
    getAdminPosts: builder.query<Post[], void>({
      query: () => ({ url: '/admin/posts' }),
      providesTags: ['Post'],
      keepUnusedDataFor: 300, // Cache for 5 minutes
    }),
    createPost: builder.mutation<Post, CreatePostInput>({
      query: (body) => ({ url: '/admin/posts', method: 'POST', body }),
      invalidatesTags: ['Post']
    }),
    updatePost: builder.mutation<Post, { id: string; body: UpdatePostInput }>({
      query: ({ id, body }) => ({ url: `/admin/posts/${id}`, method: 'PATCH', body }),
      invalidatesTags: ['Post']
    }),
    deletePost: builder.mutation<{ deleted: boolean }, string>({
      query: (id) => ({ url: `/admin/posts/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Post']
    })
  })
});

export const {
  useLoginMutation,
  useGetPublishedPostsQuery,
  useGetPostBySlugQuery,
  useGetAdminPostsQuery,
  useCreatePostMutation,
  useUpdatePostMutation,
  useDeletePostMutation,
  util: { prefetch, resetApiState },
} = api;



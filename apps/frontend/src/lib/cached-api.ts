'use server';

// Note: Cache Components ('use cache') requires Next.js canary version
// These functions now use standard Next.js caching with revalidate options

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

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

/**
 * Fetch all published posts with Next.js fetch caching
 * Revalidates every 60 seconds
 */
export async function getPublishedPosts(): Promise<Post[]> {

  try {
    const response = await fetch(`${API_URL}/posts`, {
      headers: {
        'Content-Type': 'application/json',
      },
      next: {
        revalidate: 60, // Revalidate every 60 seconds
        tags: ['posts-list'],
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch posts: ${response.statusText}`);
    }

    const posts = await response.json();
    return posts;
  } catch (error) {
    console.error('Error fetching published posts:', error);
    return [];
  }
}

/**
 * Fetch a single post by slug with Next.js fetch caching
 * Revalidates every 60 seconds
 */
export async function getPostBySlug(slug: string): Promise<Post | null> {

  try {
    const response = await fetch(`${API_URL}/posts/${slug}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      next: {
        revalidate: 60, // Revalidate every 60 seconds
        tags: ['post', `post-${slug}`],
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`Failed to fetch post: ${response.statusText}`);
    }

    const post = await response.json();
    return post;
  } catch (error) {
    console.error(`Error fetching post ${slug}:`, error);
    return null;
  }
}

/**
 * Fetch admin posts (authenticated) - Not cached by default
 * since it requires authentication and may contain drafts
 */
export async function getAdminPosts(token: string): Promise<Post[]> {
  try {
    const response = await fetch(`${API_URL}/admin/posts`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch admin posts: ${response.statusText}`);
    }

    const posts = await response.json();
    return posts;
  } catch (error) {
    console.error('Error fetching admin posts:', error);
    return [];
  }
}


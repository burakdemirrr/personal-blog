'use server';

import { revalidateTag, revalidatePath } from 'next/cache';

/**
 * Invalidate the posts list cache
 * Call this after creating or deleting a post
 */
export async function invalidatePostsList(): Promise<void> {
  try {
    // Revalidate the posts-list cache tag
    revalidateTag('posts-list');
    
    // Also revalidate the home page path
    revalidatePath('/', 'page');
    
    console.log('✅ Posts list cache invalidated');
  } catch (error) {
    console.error('❌ Error invalidating posts list cache:', error);
    throw error;
  }
}

/**
 * Invalidate a specific post's cache
 * Call this after updating a post
 * @param slug - The slug of the post to invalidate
 */
export async function invalidatePost(slug: string): Promise<void> {
  try {
    // Revalidate specific post cache tags
    revalidateTag('post');
    revalidateTag(`post-${slug}`);
    
    // Also revalidate the specific post page path
    revalidatePath(`/post/${slug}`, 'page');
    
    // Revalidate posts list too since the post might appear in lists
    revalidateTag('posts-list');
    revalidatePath('/', 'page');
    
    console.log(`✅ Post cache invalidated for slug: ${slug}`);
  } catch (error) {
    console.error(`❌ Error invalidating post cache for ${slug}:`, error);
    throw error;
  }
}

/**
 * Invalidate all post-related caches
 * Call this after bulk operations or when you want to refresh everything
 */
export async function invalidateAllPosts(): Promise<void> {
  try {
    // Revalidate all post-related cache tags
    revalidateTag('posts-list');
    revalidateTag('post');
    
    // Revalidate paths
    revalidatePath('/', 'page');
    revalidatePath('/post/[slug]', 'page');
    
    console.log('✅ All posts cache invalidated');
  } catch (error) {
    console.error('❌ Error invalidating all posts cache:', error);
    throw error;
  }
}

/**
 * Helper to invalidate cache after post mutations
 * This can be called from client components via server actions
 */
export async function invalidateCacheAfterMutation(
  action: 'create' | 'update' | 'delete',
  slug?: string
): Promise<void> {
  try {
    switch (action) {
      case 'create':
        await invalidatePostsList();
        break;
      case 'update':
        if (slug) {
          await invalidatePost(slug);
        } else {
          await invalidateAllPosts();
        }
        break;
      case 'delete':
        if (slug) {
          await invalidatePost(slug);
        }
        await invalidatePostsList();
        break;
      default:
        throw new Error(`Unknown action: ${action}`);
    }
  } catch (error) {
    console.error(`❌ Error in cache invalidation for ${action}:`, error);
    throw error;
  }
}


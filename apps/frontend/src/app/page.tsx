import { JSX, Suspense } from 'react';
import { getTranslations } from 'next-intl/server';
import { getPublishedPosts } from '@/lib/cached-api';
import { PostsListClient } from '@/components/posts-list-client';

// Loading component for Suspense fallback
function LoadingSkeleton() {
  return (
    <div className="max-w-[1000px] mr-auto ml-auto px-2">
      <div className="h-10 w-48 bg-gray-200 dark:bg-gray-700 rounded mb-6 animate-pulse"></div>
      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="space-y-2 animate-pulse">
            <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-8 w-3/4 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Server Component - fetches data with caching
export default async function Home(): Promise<JSX.Element> {
  const t = await getTranslations('HomePage');
  
  // This will be cached according to the 'posts' cacheLife profile
  const posts = await getPublishedPosts();

  if (!posts || posts.length === 0) {
    return (
      <div className="py-20 text-center text-lg text-gray-500 dark:text-gray-400">
        {t('noPosts') || 'No posts available yet.'}
      </div>
    );
  }

  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <PostsListClient posts={posts} title={t('posts')} />
    </Suspense>
  );
}

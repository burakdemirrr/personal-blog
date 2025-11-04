import { JSX, Suspense } from 'react';
import { notFound } from 'next/navigation';
import { getPostBySlug } from '@/lib/cached-api';
import { PostDetailClient } from '@/components/post-detail-client';
import type { Metadata } from 'next';

// Loading component for Suspense fallback
function LoadingSkeleton() {
  return (
    <div className="flex justify-center px-2 min-h-[70vh]">
      <div className="w-full max-w-[1000px] bg-white dark:bg-zinc-900 dark:border dark:border-zinc-800 rounded-2xl p-6 space-y-4">
        <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        <div className="h-10 w-3/4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        <div className="space-y-2 pt-4">
          <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          <div className="h-4 w-2/3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  return {
    title: post.title,
    description: post.summary || post.title,
    openGraph: {
      title: post.title,
      description: post.summary || undefined,
      type: 'article',
      publishedTime: post.publishedAt || undefined,
    },
  };
}

// Server Component - fetches data with caching
export default async function PostDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<JSX.Element> {
  const { slug } = await params;

  if (!slug) {
    notFound();
  }

  // This will be cached according to the 'blog' cacheLife profile
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <PostDetailClient post={post} />
    </Suspense>
  );
}



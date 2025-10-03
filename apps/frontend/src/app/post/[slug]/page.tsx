"use client";

import { JSX, memo, useMemo, Suspense } from 'react';
import { useParams } from 'next/navigation';
import { useGetPostBySlugQuery } from '@/services/api';
import Link from 'next/link';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';

// Lazy load ReactMarkdown for better performance
const ReactMarkdown = dynamic(() => import('react-markdown'), {
  loading: () => <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-32 rounded"></div>,
  ssr: false
});

// Memoize date formatting function
const formatDate = (iso: string | null): string => {
  if (!iso) return '';
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
};

// Optimize animation variants - remove complex easing for better performance
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: "easeOut",
      staggerChildren: 0.1,
    },
  },
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.2,
      ease: "easeOut"
    }
  },
} as const;

// Memoized loading component
const LoadingSpinner = memo(() => (
  <div className="py-20 text-center">
    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    <p className="mt-4 text-lg text-gray-500 dark:text-gray-400">Loading...</p>
  </div>
));

LoadingSpinner.displayName = 'LoadingSpinner';

// Memoized back link component
const BackLink = memo(() => (
  <Link
    href="/"
    className="text-blue-600 dark:text-blue-400 text-sm font-medium hover:underline mb-6 inline-block"
    prefetch={true}
  >
    ← Back to blog
  </Link>
));

BackLink.displayName = 'BackLink';

const PostDetailPage = (): JSX.Element => {
  const params = useParams<{ slug: string }>();
  const slug = params?.slug;
  
  // Skip query if slug is not available
  const { data, isLoading, error } = useGetPostBySlugQuery(slug!, {
    skip: !slug
  });

  // Memoize formatted date to prevent recalculation
  const formattedDate = useMemo(() =>
    data?.publishedAt ? formatDate(data.publishedAt) : '',
    [data?.publishedAt]
  );

  if (!slug) {
    return (
      <div className="py-20 text-center text-lg text-red-500 dark:text-red-400">
        Invalid post URL
      </div>
    );
  }

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error || !data) {
    return (
      <div className="py-20 text-center text-lg text-red-500 dark:text-red-400">
        Post not found
      </div>
    );
  }

  return (
    <motion.div
      className="flex justify-center px-2 min-h-[70vh] hide-scrollbar"
      initial="hidden"
      animate="visible"
      variants={cardVariants}
    >
      <article className="w-full max-w-[1000px] bg-white dark:bg-zinc-900 dark:border dark:border-zinc-800 rounded-2xl p-6">
        <motion.div variants={itemVariants}>
          <BackLink />
        </motion.div>

        <motion.h1
          className="text-3xl md:text-4xl font-bold leading-tight mb-3 text-zinc-900 dark:text-zinc-100"
          variants={itemVariants}
        >
          {data.title}
        </motion.h1>

        {formattedDate && (
          <motion.time
            className="text-sm text-zinc-500 dark:text-zinc-400 mb-8 block"
            variants={itemVariants}
            dateTime={data.publishedAt || undefined}
          >
            {formattedDate}
          </motion.time>
        )}

        <motion.div
          className="prose dark:prose-invert max-w-none text-base leading-relaxed"
          variants={itemVariants}
        >
          <Suspense fallback={<div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-32 rounded"></div>}>
            <ReactMarkdown>{data.content}</ReactMarkdown>
          </Suspense>
        </motion.div>
      </article>
    </motion.div>
  );
};

export default PostDetailPage;



"use client";

import { JSX, useMemo, memo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import type { Post } from '@/lib/cached-api';

// Memoized date formatting function
const formatDate = (iso: string | null): string => {
  if (!iso) return '';
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
};

// Optimized animation variants
const listVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
} as const;

// Extract first image URL from markdown content
const extractFirstImage = (content: string): string | null => {
  if (!content) return null;
  // Match markdown image syntax: ![alt](url)
  const imageRegex = /!\[.*?\]\((.*?)\)/;
  const match = content.match(imageRegex);
  return match ? match[1] : null;
};

// Memoized post item component
const PostItem = memo(({ post }: { post: Post }) => {
  const formattedDate = useMemo(() => formatDate(post.publishedAt), [post.publishedAt]);
  const firstImage = useMemo(() => extractFirstImage(post.content), [post.content]);
  
  return (
    <motion.li
      key={post.id}
      variants={itemVariants}
      exit={{ opacity: 0, y: 20, transition: { duration: 0.2 } }}
      layout
    >
      <time 
        className="text-sm opacity-50" 
        dateTime={post.publishedAt ?? undefined}
      >
        {formattedDate}
      </time>
      <h2 className="text-xl font-medium ">
        <Link 
          href={`/post/${post.slug}`} 
          className="underline-offset-[5px] text-[#2a7ae2] text-[24px] font-thin tracking-wide hover:underline " 
          tabIndex={0} 
          aria-label={`Read ${post.title}`}
          prefetch={true}
        >
          {post.title}
        </Link>
      </h2>
      {firstImage && (
        <div className="mt-3 mb-2">
          <img 
            src={firstImage} 
            alt={post.title}
            className="rounded-lg max-w-full h-auto max-h-[500px] object-cover"
            loading="lazy"
          />
        </div>
      )}
      {post.summary && (
        <p className="text-[14px] opacity-80 mt-1">{post.summary}</p>
      )}
    </motion.li>
  );
});

PostItem.displayName = 'PostItem';

interface PostsListClientProps {
  posts: Post[];
  title: string;
}

export function PostsListClient({ posts, title }: PostsListClientProps): JSX.Element {
  // Memoized sorted posts
  const sortedPosts = useMemo(
    () => posts.slice().sort((a, b) => {
      const da = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
      const db = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
      return db - da;
    }),
    [posts]
  );

  return (
    <motion.div
      className="max-w-[1000px] mr-auto ml-auto px-2 hide-scrollbar"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <motion.h1
        className="text-3xl font-extralight mb-6 tracking-wide"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        {title}
      </motion.h1>
      
      <motion.ul
        className="space-y-6"
        variants={listVariants}
        initial="hidden"
        animate="visible"
      >
        <AnimatePresence mode="popLayout">
          {sortedPosts.map((post) => (
            <PostItem key={post.id} post={post} />
          ))}
        </AnimatePresence>
      </motion.ul>
    </motion.div>
  );
}


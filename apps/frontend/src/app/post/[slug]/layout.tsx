import { Metadata } from 'next';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
  const { slug } = await params;
  
  try {
    const response = await fetch(`${baseUrl}/posts/${slug}`, {
      next: { revalidate: 3600 } // Cache for 1 hour
    });
    
    if (!response.ok) {
      return {
        title: 'Post Not Found',
        description: 'The requested post could not be found.',
      };
    }
    
    const post = await response.json();
    
    return {
      title: `${post.title} | Personal Blog`,
      description: post.summary || post.content.substring(0, 160) + '...',
      openGraph: {
        title: post.title,
        description: post.summary || post.content.substring(0, 160) + '...',
        type: 'article',
        publishedTime: post.publishedAt,
        modifiedTime: post.updatedAt,
      },
      twitter: {
        card: 'summary_large_image',
        title: post.title,
        description: post.summary || post.content.substring(0, 160) + '...',
      },
    };
  } catch (error) {
    return {
      title: 'Personal Blog',
      description: 'Personal blog posts and articles.',
    };
  }
}

export default function PostLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
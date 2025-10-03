'use client'
import React, { memo, useMemo } from 'react'
import { SiReact, SiNextdotjs, SiTypescript, SiTailwindcss, SiNestjs, SiAngular, SiExpo, SiRedux, SiDocker, SiRedis } from 'react-icons/si';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';

// Lazy load LogoLoop component
const LogoLoop = dynamic(() => import('@/components/LogoLoop'), {
  loading: () => <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>,
  ssr: false
});

// Memoized tech logos to prevent re-creation on each render
const techLogos = [
  { node: <SiReact />, title: "React", href: "https://react.dev" },
  { node: <SiNextdotjs />, title: "Next.js", href: "https://nextjs.org" },
  { node: <SiTypescript />, title: "TypeScript", href: "https://www.typescriptlang.org" },
  { node: <SiTailwindcss />, title: "Tailwind CSS", href: "https://tailwindcss.com" },
  { node: <SiNestjs />, title: "Nest.js", href: "https://nestjs.com" },
  { node: <SiAngular />, title: "Angular", href: "https://angular.io" },
  { node: <SiExpo />, title: "Expo", href: "https://expo.dev" },
  { node: <SiRedux />, title: "Redux", href: "https://redux.js.org" },
  { node: <SiDocker />, title: "Docker", href: "https://docker.com" },
  { node: <SiRedis />, title: "Redis", href: "https://redis.io" },
] as const;

// Optimized animation variants
const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
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
      duration: 0.3, 
      ease: "easeOut" 
    } 
  },
} as const;

// Memoized contact link component
const ContactLink = memo(() => (
  <a 
    href="mailto:mburak.demir.059@gmail.com" 
    className="text-blue-500 hover:underline transition-colors"
  >
    email
  </a>
));

ContactLink.displayName = 'ContactLink';

export default function AboutPage(): React.ReactElement {
  // Memoize current year to prevent recalculation
  const currentYear = useMemo(() => new Date().getFullYear(), []);

  return (
    <motion.div
      className="mx-auto px-4 hide-scrollbar"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.header className="mb-8" variants={itemVariants}>
        <h1 className="text-3xl font-extralight">About</h1>
      </motion.header>
      
      <motion.article
        className="prose dark:prose-invert max-w-none"
        variants={itemVariants}
      >
        <p>
          Hi, I'm Burak. I live in Istanbul, Türkiye and work as a frontend developer. I'm
          interested in modern web app architectures, performance, DX, design
          systems, and clean, readable code.
        </p>
        <p className="mt-2">
          I enjoy building fast, simple, and accessible interfaces with
          TypeScript, Next.js, and Nest.js. I write occasionally about what I'm
          learning and the side projects I'm exploring.
        </p>
        <p className="mt-2">
          You can <ContactLink /> me if you have questions or thoughts about anything I've
          built. I'd love to hear from you!
        </p>
      </motion.article>
      
      <motion.div variants={itemVariants}>
        <h2 className="text-3xl font-extralight mt-8 mb-8">Tech Stack</h2>
        <LogoLoop
          logos={techLogos}
          speed={120}
          direction="left"
          logoHeight={48}
          gap={40}
          pauseOnHover
          scaleOnHover
          fadeOut
          fadeOutColor="#ffffff"
          ariaLabel="Technology partners"
        />
      </motion.div>
      
      <motion.footer 
        className="mt-10 text-sm opacity-70"
        variants={itemVariants}
      >
        © {currentYear} Burak Demir.
      </motion.footer>
    </motion.div>
  );
}
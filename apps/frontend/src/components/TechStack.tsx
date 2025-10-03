'use client'
import React, { memo } from 'react';
import { 
  SiReact, 
  SiNextdotjs, 
  SiTypescript, 
  SiTailwindcss, 
  SiNestjs 
} from 'react-icons/si';

// Simplified tech stack with only essential technologies
const techStack = [
  { Icon: SiReact, name: "React", href: "https://react.dev" },
  { Icon: SiNextdotjs, name: "Next.js", href: "https://nextjs.org" },
  { Icon: SiTypescript, name: "TypeScript", href: "https://www.typescriptlang.org" },
  { Icon: SiTailwindcss, name: "Tailwind CSS", href: "https://tailwindcss.com" },
  { Icon: SiNestjs, name: "Nest.js", href: "https://nestjs.com" },
];

const TechStack = memo(() => {
  return (
    <div className="flex flex-wrap gap-4 items-center justify-center">
      {techStack.map(({ Icon, name, href }) => (
        <a
          key={name}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 p-3 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 group"
          title={name}
        >
          <Icon className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
          <span className="text-sm font-medium">{name}</span>
        </a>
      ))}
    </div>
  );
});

TechStack.displayName = 'TechStack';

export default TechStack;
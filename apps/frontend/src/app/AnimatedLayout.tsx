'use client';

import { memo } from 'react';

const AnimatedLayout = memo(({ children }: { children: React.ReactNode }) => {
  return (
    <main className="container mx-auto py-6 flex-1 max-w-[955px] mr-auto ml-auto px-2 hide-scrollbar overflow-y-auto">
      {children}
    </main>
  );
});

AnimatedLayout.displayName = 'AnimatedLayout';

export default AnimatedLayout;

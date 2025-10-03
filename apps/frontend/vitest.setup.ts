import '@testing-library/jest-dom';
import { vi } from 'vitest';

vi.mock('next/navigation', () => {
  return {
    useRouter: () => ({
      replace: vi.fn(),
      push: vi.fn(),
      prefetch: vi.fn(),
      back: vi.fn(),
      forward: vi.fn()
    })
  };
});



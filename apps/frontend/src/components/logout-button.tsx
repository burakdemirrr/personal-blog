"use client";

import React, { memo, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { logout } from '@/store/slices/auth-slice';
import { useRouter } from 'next/navigation';

export const LogoutButton = memo((): React.ReactElement => {
  const dispatch = useDispatch();
  const router = useRouter();
  
  const handleLogout = useCallback((): void => {
    dispatch(logout());
    router.replace('/');
  }, [dispatch, router]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLButtonElement>): void => {
    if (e.key === 'Enter') {
      (e.currentTarget as HTMLButtonElement).click();
    }
  }, []);

  return (
    <button
      className="relative px-4 py-2 text-sm font-medium text-black border border-black rounded-md transition-all cursor-pointer duration-200 hover:bg-black hover:text-white active:scale-95 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 dark:text-white dark:border-white dark:hover:bg-white dark:hover:text-black"
      onClick={handleLogout}
      aria-label="Log out"
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      Logout
    </button>
  );
});

LogoutButton.displayName = 'LogoutButton';

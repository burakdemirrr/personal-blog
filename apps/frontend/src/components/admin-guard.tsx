"use client";

import React, { useEffect, memo, useMemo } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store/store';
import { useRouter } from 'next/navigation';

type AdminGuardProps = { children: React.ReactNode };

export const AdminGuard = memo(({ children }: AdminGuardProps): React.ReactElement => {
  const router = useRouter();
  const isAuthenticated = useSelector((s: RootState) => s.auth.isAuthenticated);
  const role = useSelector((s: RootState) => s.auth.role);

  const isAuthorized = useMemo(() => {
    return isAuthenticated && role === 'admin';
  }, [isAuthenticated, role]);

  useEffect(() => {
    if (!isAuthorized) {
      router.replace('/admin/login');
    }
  }, [isAuthorized, router]);

  if (!isAuthorized) {
    return <div className="text-center py-10">Redirecting...</div>;
  }
  return <>{children}</>;
});

AdminGuard.displayName = 'AdminGuard';



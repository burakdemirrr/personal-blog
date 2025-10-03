"use client";

import React, { useState, useEffect, memo, useMemo } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store/store';
import { LogoutButton } from '@/components/logout-button';

export const AuthNavActions = memo((): React.ReactElement => {
  const [isHydrated, setIsHydrated] = useState(false);
  const isAuthenticated = useSelector((s: RootState) => s.auth.isAuthenticated);
  const role = useSelector((s: RootState) => s.auth.role);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Memoize the visibility check
  const shouldShowButton = useMemo(() => {
    return isHydrated && isAuthenticated && role !== 'admin';
  }, [isHydrated, isAuthenticated, role]);

  // Prevent hydration mismatch by not rendering until client-side hydration is complete
  if (!shouldShowButton) {
    return <></>;
  }
  
  return <LogoutButton />;
});

AuthNavActions.displayName = 'AuthNavActions';



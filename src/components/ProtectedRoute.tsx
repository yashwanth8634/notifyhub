"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import type { Role } from '../types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: Role[];
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { isAuthenticated, hasRole } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/login');
    } else if (allowedRoles && allowedRoles.length > 0 && !hasRole(allowedRoles)) {
      router.replace('/');
    }
  }, [isAuthenticated, hasRole, allowedRoles, router]);

  if (!isAuthenticated) return null;
  if (allowedRoles && allowedRoles.length > 0 && !hasRole(allowedRoles)) return null;

  return <>{children}</>;
}

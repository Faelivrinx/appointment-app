"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import LoadingSpinner from "@/components/shared/LoadingSpinner";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: string[];
}

export default function ProtectedRoute({
  children,
  requiredRoles = [],
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, hasRole, login } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      login();
      return;
    }

    if (!isLoading && isAuthenticated && requiredRoles.length > 0) {
      const hasRequiredRole = requiredRoles.some((role) => hasRole(role));
      if (!hasRequiredRole) {
        router.push("/unauthorized");
      }
    }
  }, [isAuthenticated, isLoading, router, hasRole, requiredRoles, login]);

  if (isLoading || (!isAuthenticated && requiredRoles.length > 0)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  // If authenticated and role check passes (or no roles required), render the protected content
  if (
    isAuthenticated &&
    (requiredRoles.length === 0 || requiredRoles.some((role) => hasRole(role)))
  ) {
    return <>{children}</>;
  }

  // Don't render anything while redirecting
  return (
    <div className="min-h-screen flex items-center justify-center">
      <LoadingSpinner />
      <span className="ml-3">Redirecting to login...</span>
    </div>
  );
}

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
  const { isAuthenticated, isLoading, hasRole } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // If not loading and not authenticated, redirect to login
    if (!isLoading && !isAuthenticated) {
      // Store the current path for redirect after login
      if (typeof window !== "undefined") {
        const currentPath = window.location.pathname;
        sessionStorage.setItem("auth_redirect_path", currentPath);
      }

      // Redirect to login page
      router.push("/login");
      return;
    }

    // If authenticated but missing required role, redirect to unauthorized
    if (!isLoading && isAuthenticated && requiredRoles.length > 0) {
      const hasRequiredRole = requiredRoles.some((role) => hasRole(role));
      if (!hasRequiredRole) {
        router.push("/unauthorized");
      }
    }
  }, [isAuthenticated, isLoading, router, hasRole, requiredRoles]);

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Show loading while redirecting to login
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
        <span className="ml-3">Redirecting to login...</span>
      </div>
    );
  }

  // Show loading while checking roles
  if (
    requiredRoles.length > 0 &&
    !requiredRoles.some((role) => hasRole(role))
  ) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
        <span className="ml-3">Checking permissions...</span>
      </div>
    );
  }

  // If authenticated and role check passes (or no roles required), render the protected content
  return <>{children}</>;
}

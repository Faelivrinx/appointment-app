"use client";

import { useEffect, useState } from "react";
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
  const [initialCheckDone, setInitialCheckDone] = useState(false);

  // Check auth status and redirect if necessary
  useEffect(() => {
    // Only run this once after auth is loaded
    if (!isLoading && !initialCheckDone) {
      console.log("Protected route authentication check...");
      console.log("Auth state:", { isAuthenticated, isLoading });

      setInitialCheckDone(true);

      // Add delay to ensure auth state is fully loaded
      const redirectTimer = setTimeout(() => {
        // If not authenticated, redirect to login
        if (!isAuthenticated) {
          console.log("Not authenticated, redirecting to login...");
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
        if (isAuthenticated && requiredRoles.length > 0) {
          const hasRequiredRole = requiredRoles.some((role) => hasRole(role));
          if (!hasRequiredRole) {
            console.log(
              "Missing required role, redirecting to unauthorized...",
            );
            router.push("/unauthorized");
          }
        }
      }, 500); // Small delay to ensure state is updated

      return () => clearTimeout(redirectTimer);
    }
  }, [
    isAuthenticated,
    isLoading,
    router,
    hasRole,
    requiredRoles,
    initialCheckDone,
  ]);

  // First check - show initial loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
        <span className="ml-3">Loading authentication...</span>
      </div>
    );
  }

  // Second check - show content if authenticated
  // We render the actual content immediately if authenticated to avoid flickering
  if (isAuthenticated) {
    if (requiredRoles.length > 0) {
      const hasRequiredRole = requiredRoles.some((role) => hasRole(role));

      if (!hasRequiredRole) {
        return (
          <div className="min-h-screen flex items-center justify-center">
            <LoadingSpinner size="lg" />
            <span className="ml-3">Checking permissions...</span>
          </div>
        );
      }
    }

    // If authenticated and role check passes, render the content
    return <>{children}</>;
  }

  // Show loading while redirect happens
  return (
    <div className="min-h-screen flex items-center justify-center">
      <LoadingSpinner size="lg" />
      <span className="ml-3">Checking authentication...</span>
    </div>
  );
}

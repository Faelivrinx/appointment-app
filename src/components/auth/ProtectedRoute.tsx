"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { canAccessRoute } from "@/config/roles";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [accessChecked, setAccessChecked] = useState(false);

  useEffect(() => {
    // Only run this check if authentication is loaded and we haven't checked access yet
    if (!isLoading) {
      // If not authenticated, redirect to login
      if (!isAuthenticated) {
        console.log("Not authenticated, redirecting to login...");
        // Store the current path for redirect after login
        if (typeof window !== "undefined") {
          sessionStorage.setItem("auth_redirect_path", pathname);
        }

        // Redirect to login page
        router.push("/login");
        return;
      }

      // Check role-based access
      const userRoles = user?.roles || [];
      const canAccess = canAccessRoute(pathname, userRoles);

      if (!canAccess) {
        console.log("Insufficient permissions, redirecting to unauthorized...");
        router.push("/unauthorized");
        return;
      }

      // User has access, update state
      setAccessChecked(true);
    }
  }, [isAuthenticated, isLoading, router, pathname, user]);

  // Show loading state while authentication is being checked
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
        <span className="ml-3">Loading...</span>
      </div>
    );
  }

  // If not authenticated yet, show a different loading message
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
        <span className="ml-3">Redirecting to login...</span>
      </div>
    );
  }

  // If authenticated but permissions are still being checked
  if (!accessChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
        <span className="ml-3">Verifying access...</span>
      </div>
    );
  }

  // Authentication and permissions have been checked and confirmed
  return <>{children}</>;
}

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import {
  getRedirectPath,
  getHomeRoute,
  AUTH_ROUTES,
} from "@/services/navigation";

interface RedirectOptions {
  onlyAuthenticated?: boolean;
  requiredRoles?: string[];
  allowAuthPageIfAuthenticated?: boolean; // Whether to allow authenticated users to view auth pages
}

export function useRedirect(options: RedirectOptions = {}) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [accessChecked, setAccessChecked] = useState(false);

  useEffect(() => {
    // Skip redirection logic during loading
    if (isLoading) {
      console.log("Loading...");
      return;
    }

    const roles = user?.roles || [];

    // Check if current page is an auth page
    const isAuthPage = AUTH_ROUTES.some(
      (route) => pathname === route || pathname.startsWith(`${route}/`),
    );

    // If user is authenticated and on an auth page, redirect to home
    if (
      isAuthenticated &&
      isAuthPage &&
      !options.allowAuthPageIfAuthenticated
    ) {
      router.push(getHomeRoute(roles));
      return;
    }

    // If only authenticated users allowed and user is not authenticated
    if (options.onlyAuthenticated && !isAuthenticated) {
      // Store current path for redirect after login
      if (typeof window !== "undefined") {
        sessionStorage.setItem("auth_redirect_path", pathname);
      }
      router.push("/login");
      return;
    }

    // If specific roles required, check if user has any of them
    if (options.requiredRoles && options.requiredRoles.length > 0) {
      const hasRequiredRole = options.requiredRoles.some((role) =>
        roles.some((userRole) => userRole.toUpperCase() === role.toUpperCase()),
      );

      if (!hasRequiredRole) {
        console.log("Unauthorized access");
        router.push("/unauthorized");
        return;
      }
    }

    // Check if redirect needed based on current path and roles
    const redirectPath = getRedirectPath(pathname, roles, isAuthenticated);
    if (redirectPath) {
      router.push(redirectPath);
      return;
    }

    // If we reach here, user has access
    setAccessChecked(true);
  }, [isAuthenticated, isLoading, pathname, router, user, options]);

  // Return useful navigation helpers and state
  return {
    navigateToHome: () => router.push(getHomeRoute(user?.roles || [])),
    accessChecked,
    isLoading,
  };
}

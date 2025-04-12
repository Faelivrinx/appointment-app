import { UserRole, PUBLIC_ROUTES } from "@/config/roles";

// Define route destinations by role
export type RouteDestination = {
  [key in UserRole | "DEFAULT"]?: string;
};

// Define redirection map - where users should go based on their roles
export const HOME_ROUTES: RouteDestination = {
  [UserRole.CLIENT]: "/client",
  [UserRole.BUSINESS_OWNER]: "/business/services",
  DEFAULT: "/login", // Fallback for unauthenticated users
};

// Landing routes for specific sections
export const SECTION_HOME_ROUTES: Record<string, RouteDestination> = {
  "/business": {
    [UserRole.BUSINESS_OWNER]: "/business/services",
    DEFAULT: "/unauthorized",
  },
  "/client": {
    [UserRole.CLIENT]: "/client",
    DEFAULT: "/unauthorized",
  },
};

/**
 * Determines the appropriate home route based on user roles
 */
export function getHomeRoute(roles: string[] = []): string {
  // Convert role strings to enum values if needed
  const mappedRoles = roles.map((role) => role.toUpperCase());

  // Check for each role in priority order

  if (mappedRoles.includes(UserRole.BUSINESS_OWNER)) {
    return HOME_ROUTES[UserRole.BUSINESS_OWNER] || "/business";
  }

  if (mappedRoles.includes(UserRole.CLIENT)) {
    return HOME_ROUTES[UserRole.CLIENT] || "/client";
  }

  // Default fallback
  return HOME_ROUTES.DEFAULT || "/login";
}

// Define authentication related routes that logged-in users should not access
export const AUTH_ROUTES = [
  "/login",
  "/signup",
  "/activation-code",
  "/forgot-password",
];

/**
 * Determines if redirect is needed based on current path and user roles
 * @returns destination path if redirect needed, null otherwise
 */
export function getRedirectPath(
  currentPath: string,
  roles: string[] = [],
  isAuthenticated: boolean,
): string | null {
  // If authenticated and trying to access auth routes, redirect to appropriate home page
  if (
    isAuthenticated &&
    AUTH_ROUTES.some(
      (route) => currentPath === route || currentPath.startsWith(`${route}/`),
    )
  ) {
    return getHomeRoute(roles);
  }

  // If not authenticated and public route, allow access
  if (
    !isAuthenticated &&
    PUBLIC_ROUTES.some(
      (route) => currentPath === route || currentPath.startsWith(`${route}/`),
    )
  ) {
    return null;
  }

  // If not authenticated and not on public route, redirect to login
  if (
    !isAuthenticated &&
    !PUBLIC_ROUTES.some(
      (route) => currentPath === route || currentPath.startsWith(`${route}/`),
    )
  ) {
    return "/login";
  }

  // Find the section this path belongs to
  const section = Object.keys(SECTION_HOME_ROUTES).find(
    (section) =>
      currentPath === section || currentPath.startsWith(`${section}/`),
  );

  if (section) {
    const destinations = SECTION_HOME_ROUTES[section];

    // Check if user has any role that allows access to this section
    const hasAccess = roles.some((role) => {
      const upperRole = role.toUpperCase();
      return Object.keys(destinations).includes(upperRole);
    });

    if (!hasAccess) {
      return destinations.DEFAULT || "/unauthorized";
    }
  }

  // No redirect needed
  return null;
}

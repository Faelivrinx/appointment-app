// Define user roles
export enum UserRole {
  CLIENT = "CLIENT",
  BUSINESS_OWNER = "BUSINESS_OWNER",
  ADMIN = "ADMIN",
}

// Define route access by role
export type RouteAccess = {
  path: string;
  allowedRoles: UserRole[];
};

// Route configuration
export const ROUTE_ACCESS: RouteAccess[] = [
  // Dashboard is accessible by all authenticated users
  {
    path: "/dashboard",
    allowedRoles: [UserRole.CLIENT, UserRole.BUSINESS_OWNER, UserRole.ADMIN],
  },

  // Business routes
  {
    path: "/business",
    allowedRoles: [UserRole.BUSINESS_OWNER, UserRole.ADMIN],
  },
  {
    path: "/business/services",
    allowedRoles: [UserRole.BUSINESS_OWNER, UserRole.ADMIN],
  },
  {
    path: "/business/staff",
    allowedRoles: [UserRole.BUSINESS_OWNER, UserRole.ADMIN],
  },
  {
    path: "/business/settings",
    allowedRoles: [UserRole.BUSINESS_OWNER, UserRole.ADMIN],
  },

  // Client routes
  { path: "/client", allowedRoles: [UserRole.CLIENT, UserRole.ADMIN] },
  {
    path: "/client/appointments",
    allowedRoles: [UserRole.CLIENT, UserRole.ADMIN],
  },
  { path: "/client/history", allowedRoles: [UserRole.CLIENT, UserRole.ADMIN] },

  // Admin routes
  { path: "/admin", allowedRoles: [UserRole.ADMIN] },
];

// Public routes that don't require authentication
export const PUBLIC_ROUTES = [
  "/login",
  "/signup",
  "/activation-code",
  "/forgot-password",
  "/",
];

// Helper function to check if a route is accessible by role
export function canAccessRoute(path: string, userRoles: string[]): boolean {
  // Check if it's a public route
  if (
    PUBLIC_ROUTES.some(
      (route) => path === route || path.startsWith(`${route}/`),
    )
  ) {
    return true;
  }

  // For dynamic routes, we need to handle patterns
  const matchingRoute = ROUTE_ACCESS.find((route) => {
    // Exact match
    if (route.path === path) return true;

    // Check if it's a subpath
    if (path.startsWith(`${route.path}/`)) return true;

    return false;
  });

  if (!matchingRoute) return false;

  console.log("Matching route found:", matchingRoute);
  console.log("User roles:", userRoles);

  // Check if user has any of the required roles
  return matchingRoute.allowedRoles.some((role) => userRoles.includes(role));
}

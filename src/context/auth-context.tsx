"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import * as authService from "@/services/auth";
import { canAccessRoute, PUBLIC_ROUTES } from "@/config/roles";

// Define the User type
export type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: string[];
};

// Define the Auth Context type
type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  accessToken: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  refreshUserToken: () => Promise<boolean>;
  hasRole: (role: string) => boolean;
  canAccess: (path: string) => boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Storage keys
const STORAGE_KEY = authService.STORAGE_KEY;

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [tokenExpiry, setTokenExpiry] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const pathname = usePathname();
  const router = useRouter();

  // Check if the token is expired or will expire soon (within 1 minute)
  const isTokenExpired = (): boolean => {
    if (!tokenExpiry) return true;
    return Date.now() + 60000 > tokenExpiry; // 60000ms = 1 minute
  };

  // Refresh the token if needed
  const refreshUserToken = async (): Promise<boolean> => {
    if (!refreshToken) return false;

    try {
      const success = await authService.refreshToken();

      if (success) {
        // Update state with refreshed tokens
        const newAccessToken = localStorage.getItem(STORAGE_KEY.ACCESS_TOKEN);
        const newRefreshToken = localStorage.getItem(STORAGE_KEY.REFRESH_TOKEN);
        const newExpiry = localStorage.getItem(STORAGE_KEY.TOKEN_EXPIRY);

        if (newAccessToken && newRefreshToken && newExpiry) {
          setAccessToken(newAccessToken);
          setRefreshToken(newRefreshToken);
          setTokenExpiry(parseInt(newExpiry, 10));
          return true;
        }
      }

      // If refresh failed, clear auth data
      clearAuthData();
      return false;
    } catch (error) {
      console.error("Failed to refresh token:", error);
      clearAuthData();
      return false;
    }
  };

  // Clear authentication data
  const clearAuthData = () => {
    setUser(null);
    setAccessToken(null);
    setRefreshToken(null);
    setTokenExpiry(null);
    authService.logout();
  };

  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      try {
        if (typeof window !== "undefined") {
          const storedAccessToken = localStorage.getItem(
            STORAGE_KEY.ACCESS_TOKEN,
          );
          const storedRefreshToken = localStorage.getItem(
            STORAGE_KEY.REFRESH_TOKEN,
          );
          const storedExpiry = localStorage.getItem(STORAGE_KEY.TOKEN_EXPIRY);
          const storedUser = localStorage.getItem(STORAGE_KEY.USER);

          if (storedAccessToken && storedRefreshToken && storedExpiry) {
            setAccessToken(storedAccessToken);
            setRefreshToken(storedRefreshToken);
            setTokenExpiry(parseInt(storedExpiry, 10));

            if (storedUser) {
              setUser(JSON.parse(storedUser));
            }

            // Check if token needs to be refreshed
            if (parseInt(storedExpiry, 10) < Date.now() + 60000) {
              const refreshed = await refreshUserToken();
              if (
                !refreshed &&
                !PUBLIC_ROUTES.some(
                  (route) =>
                    pathname === route || pathname.startsWith(`${route}/`),
                )
              ) {
                // Token refresh failed and not on a public page
                toast.error("Your session has expired. Please log in again.");
                clearAuthData();
                router.push("/login");
              }
            }
          }
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
        clearAuthData();
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, [pathname, router]);

  // Check if user has a specific role
  const hasRole = (role: string): boolean => {
    if (!user || !user.roles) return false;
    return user.roles.some((r) => r.toLowerCase() === role.toLowerCase());
  };

  // Check if user can access a specific path
  const canAccess = (path: string): boolean => {
    if (!user || !user.roles) {
      return PUBLIC_ROUTES.some(
        (route) => path === route || path.startsWith(`${route}/`),
      );
    }
    return canAccessRoute(path, user.roles);
  };

  // Login function - uses direct login with email and password
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const userData = await authService.login(email, password);

      if (userData) {
        setUser(userData);

        // Set tokens in state
        const newAccessToken = localStorage.getItem(STORAGE_KEY.ACCESS_TOKEN);
        const newRefreshToken = localStorage.getItem(STORAGE_KEY.REFRESH_TOKEN);
        const newExpiry = localStorage.getItem(STORAGE_KEY.TOKEN_EXPIRY);

        if (newAccessToken && newRefreshToken && newExpiry) {
          setAccessToken(newAccessToken);
          setRefreshToken(newRefreshToken);
          setTokenExpiry(parseInt(newExpiry, 10));
        }

        return true;
      }

      return false;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  };

  // Logout function
  const logout = () => {
    clearAuthData();
    router.push("/login");
  };

  // Set up token refresh interval
  useEffect(() => {
    if (!accessToken || !refreshToken) return;

    const tokenRefreshInterval = setInterval(
      async () => {
        if (isTokenExpired()) {
          const refreshed = await refreshUserToken();
          if (!refreshed) {
            clearInterval(tokenRefreshInterval);
            toast.error("Your session has expired. Please log in again.");
            clearAuthData();
            router.push("/login");
          }
        }
      },
      5 * 60 * 1000,
    ); // Check every 5 minutes

    return () => {
      clearInterval(tokenRefreshInterval);
    };
  }, [accessToken, refreshToken, router]);

  // Auth context value
  const value = {
    user,
    isAuthenticated: !!user && !!accessToken && !isTokenExpired(),
    isLoading,
    accessToken,
    login,
    logout,
    refreshUserToken,
    hasRole,
    canAccess,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Hook to use the auth context
export function useAuth() {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}

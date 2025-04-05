"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import * as keycloakService from "@/services/keycloak";

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
  login: () => void;
  logout: () => void;
  refreshUserToken: () => Promise<boolean>;
  hasRole: (role: string) => boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Storage keys
const STORAGE_KEY = {
  ACCESS_TOKEN: "appointment_app_access_token",
  REFRESH_TOKEN: "appointment_app_refresh_token",
  TOKEN_EXPIRY: "appointment_app_token_expiry",
  USER: "appointment_app_user",
};

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

  // Check if the token is expired or will expire soon (within 1 minute)
  const isTokenExpired = (): boolean => {
    if (!tokenExpiry) return true;
    return Date.now() + 60000 > tokenExpiry; // 60000ms = 1 minute
  };

  // Refresh the token if needed
  const refreshUserToken = async (): Promise<boolean> => {
    if (!refreshToken) return false;

    try {
      const tokenResponse = await keycloakService.refreshToken(refreshToken);

      // Update tokens in state and storage
      setAccessToken(tokenResponse.access_token);
      setRefreshToken(tokenResponse.refresh_token);

      const newExpiry = Date.now() + tokenResponse.expires_in * 1000;
      setTokenExpiry(newExpiry);

      // Update storage
      if (typeof window !== "undefined") {
        localStorage.setItem(
          STORAGE_KEY.ACCESS_TOKEN,
          tokenResponse.access_token,
        );
        localStorage.setItem(
          STORAGE_KEY.REFRESH_TOKEN,
          tokenResponse.refresh_token,
        );
        localStorage.setItem(STORAGE_KEY.TOKEN_EXPIRY, newExpiry.toString());
      }

      return true;
    } catch (error) {
      console.error("Failed to refresh token:", error);
      // If refresh fails, prepare for login
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

    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEY.ACCESS_TOKEN);
      localStorage.removeItem(STORAGE_KEY.REFRESH_TOKEN);
      localStorage.removeItem(STORAGE_KEY.TOKEN_EXPIRY);
      localStorage.removeItem(STORAGE_KEY.USER);
    }
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
                pathname !== "/login" &&
                !pathname.startsWith("/auth/")
              ) {
                // Token refresh failed, redirect to login
                login();
              }
            }
          } else if (pathname !== "/login" && !pathname.startsWith("/auth/")) {
            // No tokens found, show loading while redirecting
            setIsLoading(true);
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
  }, [pathname]);

  // Check if user has a specific role
  const hasRole = (role: string): boolean => {
    if (!user || !user.roles) return false;
    return user.roles.includes(role);
  };

  // Login function - initiates OAuth flow
  const login = () => {
    if (typeof window !== "undefined") {
      // Store the current path to redirect back after login
      if (pathname !== "/login" && !pathname.startsWith("/auth/")) {
        sessionStorage.setItem("auth_redirect_path", pathname);
      }

      // Start the auth flow
      keycloakService.initiateLogin();
    }
  };

  // Logout function
  const logout = () => {
    clearAuthData();

    // Call Keycloak logout
    if (typeof window !== "undefined") {
      keycloakService.logout(window.location.origin + "/login");
    }
  };

  // Set up token refresh interval
  useEffect(() => {
    if (!isAuthenticated || !refreshToken) return;

    const tokenRefreshInterval = setInterval(
      async () => {
        if (isTokenExpired()) {
          const refreshed = await refreshUserToken();
          if (!refreshed) {
            clearInterval(tokenRefreshInterval);
          }
        }
      },
      5 * 60 * 1000,
    ); // Check every 5 minutes

    return () => {
      clearInterval(tokenRefreshInterval);
    };
  }, [isTokenExpired, refreshToken]);

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

"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// Define the User type
export type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  roles?: string[];
};

// Define the Auth Context type
type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  accessToken: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (
    userData: Omit<User, "id" | "roles"> & { password: string },
  ) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
  hasRole: (role: string) => boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (typeof window !== "undefined") {
          // In a real app with Keycloak/JWT, we would:
          // 1. Check if there's a valid token in localStorage or cookies
          // 2. Validate the token or try to refresh it if expired
          // 3. Decode the token to get user information

          const storedUser = localStorage.getItem("user");
          const storedToken = localStorage.getItem("token");

          if (storedUser && storedToken) {
            setUser(JSON.parse(storedUser));
            setAccessToken(storedToken);
          }
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
        // Clear potentially corrupted data
        if (typeof window !== "undefined") {
          localStorage.removeItem("user");
          localStorage.removeItem("token");
          localStorage.removeItem("refreshToken");
        }
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Refresh token function - for JWT token refresh
  // Refresh token function - for JWT token refresh
  const refreshToken = async () => {
    // In a real app with JWT auth, this would:
    // 1. Use the refresh token to get a new access token
    // 2. Update the tokens in storage
    // 3. Update the state

    console.log("Token refresh would happen here");
    return Promise.resolve();
  };

  // Check if user has a specific role
  const hasRole = (role: string): boolean => {
    if (!user || !user.roles) return false;
    return user.roles.includes(role);
  };

  // Login function - simulate API call
  const login = async (email: string, password: string) => {
    setIsLoading(true);

    try {
      // In a real app with Keycloak/JWT, we would:
      // 1. Send credentials to authentication server
      // 2. Receive tokens (access token, refresh token)
      // 3. Decode JWT to get user info or make a separate request for user details

      // For now, simulate a successful login
      const mockUser: User = {
        id: "user-123",
        email,
        firstName: "Demo",
        lastName: "User",
        phone: "+1234567890",
        roles: ["user"],
      };

      const mockAccessToken =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyLTEyMyIsImVtYWlsIjoiZGVtb0BleGFtcGxlLmNvbSIsIm5hbWUiOiJEZW1vIFVzZXIiLCJpYXQiOjE2MTYyMzkwMjIsInJvbGVzIjpbInVzZXIiXX0.mock-jwt-signature";

      // Store user data and auth tokens
      if (typeof window !== "undefined") {
        localStorage.setItem("user", JSON.stringify(mockUser));
        localStorage.setItem("token", mockAccessToken);
        localStorage.setItem("refreshToken", "mock-refresh-token");
      }

      setUser(mockUser);
      setAccessToken(mockAccessToken);
      router.push("/dashboard"); // Redirect to dashboard after login
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Signup function - simulate API call
  const signup = async (
    userData: Omit<User, "id" | "roles"> & { password: string },
  ) => {
    setIsLoading(true);

    try {
      // In a real app with Keycloak/JWT, we would:
      // 1. Send registration data to the authentication server
      // 2. Possibly receive tokens if auto-login after registration

      // For now, simulate a successful registration
      const mockUser: User = {
        id: `user-${Math.random().toString(36).substr(2, 9)}`,
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        phone: userData.phone,
        roles: ["user"],
      };

      // In a real app, you might not store tokens here if verification is required
      // For demo purposes, we'll simulate an immediate login
      if (typeof window !== "undefined") {
        localStorage.setItem("user", JSON.stringify(mockUser));
        localStorage.setItem("token", "mock-registration-jwt-token");
        localStorage.setItem("refreshToken", "mock-registration-refresh-token");
      }

      setUser(mockUser);
      setAccessToken("mock-registration-jwt-token");
      router.push("/activation-code"); // Redirect to activation code page
    } catch (error) {
      console.error("Signup error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    // In a real app with Keycloak, we would:
    // 1. Call the logout endpoint to invalidate the session server-side
    // 2. Clear local tokens

    if (typeof window !== "undefined") {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
    }

    setUser(null);
    setAccessToken(null);
    router.push("/login");
  };

  // Auth context value
  const value = {
    user,
    isAuthenticated: !!user && !!accessToken,
    isLoading,
    accessToken,
    login,
    signup,
    logout,
    refreshToken,
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

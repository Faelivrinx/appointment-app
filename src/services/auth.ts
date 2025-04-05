import { toast } from "sonner";
import * as keycloakService from "./keycloak";
import { User } from "@/context/auth-context";

// Storage keys
export const STORAGE_KEY = {
  ACCESS_TOKEN: "appointment_app_access_token",
  REFRESH_TOKEN: "appointment_app_refresh_token",
  TOKEN_EXPIRY: "appointment_app_token_expiry",
  USER: "appointment_app_user",
};

// Login function that uses direct username/password authentication
export async function login(
  email: string,
  password: string,
): Promise<User | null> {
  try {
    // Use direct login with username and password
    const tokenResponse = await keycloakService.directLogin(email, password);

    // Parse the JWT token to get user information
    const decodedToken = keycloakService.parseJWT(tokenResponse.access_token);
    const roles = keycloakService.getRolesFromToken(tokenResponse.access_token);

    // Create the user object
    const userData: User = {
      id: decodedToken.sub,
      email: decodedToken.email || decodedToken.preferred_username,
      firstName: decodedToken.given_name || "",
      lastName: decodedToken.family_name || "",
      roles: roles,
    };

    // Set expiry time
    const expiresAt = Date.now() + tokenResponse.expires_in * 1000;

    // Store tokens and user data in local storage
    localStorage.setItem(STORAGE_KEY.USER, JSON.stringify(userData));
    localStorage.setItem(STORAGE_KEY.ACCESS_TOKEN, tokenResponse.access_token);
    localStorage.setItem(
      STORAGE_KEY.REFRESH_TOKEN,
      tokenResponse.refresh_token,
    );
    localStorage.setItem(STORAGE_KEY.TOKEN_EXPIRY, expiresAt.toString());

    return userData;
  } catch (error) {
    console.error("Login error:", error);

    let errorMessage = "Authentication failed. Please check your credentials.";
    if (error instanceof Error) {
      errorMessage = error.message;
    }

    toast.error(errorMessage);
    throw error;
  }
}

// Function to check if user is authenticated
export function isAuthenticated(): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  const token = localStorage.getItem(STORAGE_KEY.ACCESS_TOKEN);
  const expiry = localStorage.getItem(STORAGE_KEY.TOKEN_EXPIRY);

  if (!token || !expiry) {
    return false;
  }

  // Check if token is expired
  const expiryTime = parseInt(expiry, 10);
  return Date.now() < expiryTime;
}

// Function to get stored user
export function getUser(): User | null {
  if (typeof window === "undefined") {
    return null;
  }

  const userStr = localStorage.getItem(STORAGE_KEY.USER);
  if (!userStr) {
    return null;
  }

  try {
    return JSON.parse(userStr);
  } catch (error) {
    console.error("Error parsing user data:", error);
    return null;
  }
}

// Logout function
export function logout(): void {
  // Clear all authentication data
  if (typeof window !== "undefined") {
    localStorage.removeItem(STORAGE_KEY.ACCESS_TOKEN);
    localStorage.removeItem(STORAGE_KEY.REFRESH_TOKEN);
    localStorage.removeItem(STORAGE_KEY.TOKEN_EXPIRY);
    localStorage.removeItem(STORAGE_KEY.USER);
  }
}

// Refresh the access token
export async function refreshToken(): Promise<boolean> {
  const refreshToken = localStorage.getItem(STORAGE_KEY.REFRESH_TOKEN);

  if (!refreshToken) {
    return false;
  }

  try {
    const tokenResponse = await keycloakService.refreshToken(refreshToken);

    // Update tokens and expiry
    localStorage.setItem(STORAGE_KEY.ACCESS_TOKEN, tokenResponse.access_token);
    localStorage.setItem(
      STORAGE_KEY.REFRESH_TOKEN,
      tokenResponse.refresh_token,
    );

    const expiresAt = Date.now() + tokenResponse.expires_in * 1000;
    localStorage.setItem(STORAGE_KEY.TOKEN_EXPIRY, expiresAt.toString());

    return true;
  } catch (error) {
    console.error("Failed to refresh token:", error);
    return false;
  }
}

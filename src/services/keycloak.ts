// Keycloak Service for managing authentication with Keycloak SSO using Authorization Code Flow with PKCE

// Define Keycloak configuration
export const KEYCLOAK_CONFIG = {
  url: process.env.NEXT_PUBLIC_KEYCLOAK_URL || "http://localhost:8080",
  realm: process.env.NEXT_PUBLIC_KEYCLOAK_REALM || "appointment-app",
  clientId:
    process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID || "appointment-frontend",
};

// Token response from Keycloak
export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  id_token?: string;
  expires_in: number;
  refresh_expires_in: number;
  token_type: string;
  scope: string;
}

// User profile from Keycloak
export interface UserProfile {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  enabled: boolean;
  emailVerified: boolean;
  attributes?: Record<string, any>;
}

/**
 * Generate a cryptographically random string suitable for PKCE
 */
export function generateCodeVerifier(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return base64URLEncode(array);
}

/**
 * Create a code challenge from a code verifier (for PKCE)
 */
export async function generateCodeChallenge(
  codeVerifier: string,
): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(codeVerifier);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return base64URLEncode(new Uint8Array(digest));
}

/**
 * Base64URL encoding (for PKCE)
 */
function base64URLEncode(buffer: Uint8Array): string {
  return btoa(String.fromCharCode(...Array.from(buffer)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

/**
 * Initiates the authorization code flow with PKCE
 * Redirects the user to Keycloak login page
 */
export function initiateLogin(): void {
  // Generate PKCE code verifier and challenge
  const codeVerifier = generateCodeVerifier();

  // Store code verifier in session storage to use later when exchanging the code
  sessionStorage.setItem("code_verifier", codeVerifier);

  // Generate code challenge from verifier
  generateCodeChallenge(codeVerifier).then((codeChallenge) => {
    // Create authorization URL with PKCE parameters
    const authUrl = new URL(
      `${KEYCLOAK_CONFIG.url}/realms/${KEYCLOAK_CONFIG.realm}/protocol/openid-connect/auth`,
    );

    // Current URL for the redirect_uri
    const redirectUri = `${window.location.origin}/auth/callback`;

    // Store the redirect path to return to after login
    const currentPath = window.location.pathname;
    if (currentPath !== "/login" && currentPath !== "/auth/callback") {
      sessionStorage.setItem("auth_redirect_path", currentPath);
    }

    // Add required parameters
    authUrl.searchParams.append("client_id", KEYCLOAK_CONFIG.clientId);
    authUrl.searchParams.append("redirect_uri", redirectUri);
    authUrl.searchParams.append("response_type", "code");
    authUrl.searchParams.append("scope", "openid profile email");
    authUrl.searchParams.append("code_challenge", codeChallenge);
    authUrl.searchParams.append("code_challenge_method", "S256");

    // Add a state parameter to prevent CSRF
    const state = generateCodeVerifier();
    sessionStorage.setItem("auth_state", state);
    authUrl.searchParams.append("state", state);

    // Redirect to authorization endpoint
    window.location.href = authUrl.toString();
  });
}

/**
 * Exchanges authorization code for tokens
 * Called after the user is redirected back from Keycloak
 */
export async function handleAuthCallback(
  code: string,
  state: string,
): Promise<TokenResponse> {
  // Verify state to prevent CSRF attacks
  const storedState = sessionStorage.getItem("auth_state");
  if (!storedState || storedState !== state) {
    throw new Error("Invalid state parameter");
  }

  // Get the code verifier stored before the redirect
  const codeVerifier = sessionStorage.getItem("code_verifier");
  if (!codeVerifier) {
    throw new Error("Code verifier not found");
  }

  // Exchange code for tokens
  const tokenUrl = `${KEYCLOAK_CONFIG.url}/realms/${KEYCLOAK_CONFIG.realm}/protocol/openid-connect/token`;

  const params = new URLSearchParams();
  params.append("client_id", KEYCLOAK_CONFIG.clientId);
  params.append("grant_type", "authorization_code");
  params.append("code", code);
  params.append("redirect_uri", `${window.location.origin}/auth/callback`);
  params.append("code_verifier", codeVerifier);

  const response = await fetch(tokenUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.error_description || "Failed to exchange code for tokens",
    );
  }

  // Clear the state and code verifier from storage
  sessionStorage.removeItem("auth_state");
  sessionStorage.removeItem("code_verifier");

  return response.json();
}

/**
 * Refreshes an access token using a refresh token
 */
export async function refreshToken(
  refreshToken: string,
): Promise<TokenResponse> {
  const url = `${KEYCLOAK_CONFIG.url}/realms/${KEYCLOAK_CONFIG.realm}/protocol/openid-connect/token`;

  const params = new URLSearchParams();
  params.append("client_id", KEYCLOAK_CONFIG.clientId);
  params.append("grant_type", "refresh_token");
  params.append("refresh_token", refreshToken);

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params,
  });

  if (!response.ok) {
    throw new Error("Failed to refresh token");
  }

  return response.json();
}

/**
 * Fetches the user profile from Keycloak
 */
export async function getUserProfile(
  accessToken: string,
): Promise<UserProfile> {
  const url = `${KEYCLOAK_CONFIG.url}/realms/${KEYCLOAK_CONFIG.realm}/protocol/openid-connect/userinfo`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch user profile");
  }

  return response.json();
}

/**
 * Logs out a user from Keycloak using the end session endpoint
 */
export function logout(redirectUri: string = window.location.origin): void {
  // Clear local storage/session storage
  localStorage.removeItem("appointment_app_access_token");
  localStorage.removeItem("appointment_app_refresh_token");
  localStorage.removeItem("appointment_app_token_expiry");
  localStorage.removeItem("appointment_app_user");

  // Redirect to Keycloak logout
  const logoutUrl = new URL(
    `${KEYCLOAK_CONFIG.url}/realms/${KEYCLOAK_CONFIG.realm}/protocol/openid-connect/logout`,
  );
  logoutUrl.searchParams.append("redirect_uri", redirectUri);

  window.location.href = logoutUrl.toString();
}

/**
 * Parse JWT token to get claims
 */
export function parseJWT(token: string): any {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(window.atob(base64));
  } catch (error) {
    console.error("Error parsing JWT:", error);
    return {};
  }
}

/**
 * Get user roles from the access token
 */
export function getRolesFromToken(accessToken: string): string[] {
  const decoded = parseJWT(accessToken);

  // Keycloak typically stores roles in realm_access.roles and resource_access[client_id].roles
  const realmRoles = decoded.realm_access?.roles || [];
  const clientRoles =
    decoded.resource_access?.[KEYCLOAK_CONFIG.clientId]?.roles || [];

  return [...realmRoles, ...clientRoles];
}

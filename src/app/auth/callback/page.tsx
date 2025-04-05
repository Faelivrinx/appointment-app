"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  handleAuthCallback,
  parseJWT,
  getRolesFromToken,
} from "@/services/keycloak";
import LoadingSpinner from "@/components/shared/LoadingSpinner";

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function processCallback() {
      try {
        const code = searchParams.get("code");
        const state = searchParams.get("state");
        const error = searchParams.get("error");
        const errorDescription = searchParams.get("error_description");

        if (error) {
          console.error("Authentication error:", error, errorDescription);
          setError(errorDescription || "Authentication failed");
          setTimeout(() => router.push("/login"), 3000);
          return;
        }

        if (!code || !state) {
          setError("Invalid callback parameters");
          setTimeout(() => router.push("/login"), 3000);
          return;
        }

        const tokenResponse = await handleAuthCallback(code, state);

        const decodedToken = parseJWT(tokenResponse.access_token);
        const roles = getRolesFromToken(tokenResponse.access_token);

        const userData = {
          id: decodedToken.sub,
          email: decodedToken.email || decodedToken.preferred_username,
          firstName: decodedToken.given_name || "",
          lastName: decodedToken.family_name || "",
          roles: roles,
        };

        const expiresAt = Date.now() + tokenResponse.expires_in * 1000;

        localStorage.setItem("appointment_app_user", JSON.stringify(userData));
        localStorage.setItem(
          "appointment_app_access_token",
          tokenResponse.access_token,
        );
        localStorage.setItem(
          "appointment_app_refresh_token",
          tokenResponse.refresh_token,
        );
        localStorage.setItem(
          "appointment_app_token_expiry",
          expiresAt.toString(),
        );

        const redirectPath =
          sessionStorage.getItem("auth_redirect_path") || "/dashboard";
        sessionStorage.removeItem("auth_redirect_path");

        router.push(redirectPath);
      } catch (err) {
        console.error("Failed to process authentication callback:", err);
        setError("Authentication failed. Please try again.");
        setTimeout(() => router.push("/login"), 3000);
      }
    }

    processCallback();
  }, [router, searchParams]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-neutral-lightest via-white to-shocking-pink-light/10">
      {error ? (
        <div className="text-center max-w-md p-6">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            Authentication Error
          </h1>
          <p className="mb-6 text-text-200">{error}</p>
          <p className="text-sm text-text-200">Redirecting to login page...</p>
        </div>
      ) : (
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-6 text-text-200">Completing your login...</p>
        </div>
      )}
    </div>
  );
}

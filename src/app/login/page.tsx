"use client";

import AuthLayout from "@/components/auth/AuthLayout";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import LoginForm from "@/components/auth/LoginForm";
import { useRedirect } from "@/hooks/useRedirect";

export default function LoginPage() {
  const { isLoading } = useRedirect();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-neutral-lightest via-white to-shocking-pink-light/10">
        <LoadingSpinner size="lg" />
        <span className="ml-3">Redirecting...</span>
      </div>
    );
  }

  return (
    <AuthLayout>
      <LoginForm />
    </AuthLayout>
  );
}

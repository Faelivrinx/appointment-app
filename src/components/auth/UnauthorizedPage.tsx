// src/app/unauthorized/page.tsx
"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Shield, ArrowLeft } from "lucide-react";
import { useAuth } from "@/context/auth-context";

export default function UnauthorizedPage() {
  const router = useRouter();
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-lightest via-white to-shocking-pink-light/10 flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
        <div className="mx-auto w-16 h-16 flex items-center justify-center bg-red-100 rounded-full mb-6">
          <Shield className="h-8 w-8 text-red-500" />
        </div>

        <h1 className="text-2xl font-bold text-text-100 mb-2">Access Denied</h1>

        <p className="text-text-200 mb-6">
          You don't have permission to access this page. This area requires
          additional privileges.
        </p>

        {user && user.roles && (
          <div className="mb-6">
            <p className="text-sm text-text-200 mb-2">Your current roles:</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {user.roles.map((role, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-accent-100/20 text-accent-200 rounded-full text-sm"
                >
                  {role}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={() => router.push("/dashboard")}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>

          <Button variant="destructive" onClick={() => logout()}>
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
}

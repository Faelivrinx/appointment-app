"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import LoginIllustration from "@/components/shared/LoginIllustration";

interface AuthLayoutProps {
  children: React.ReactNode;
  mobileIllustration?: boolean;
}

export default function AuthLayout({
  children,
  mobileIllustration = true,
}: AuthLayoutProps) {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-neutral-lightest via-white to-shocking-pink-light/10 p-4 sm:p-6">
      <Card className="w-full max-w-4xl overflow-hidden border-none shadow-lg md:grid md:grid-cols-2 bg-white">
        {/* Mobile Header with Illustration */}
        {mobileIllustration && (
          <div className="md:hidden bg-shocking-pink-light/10 p-6 flex justify-center items-center">
            <div className="w-24 h-24">
              <LoginIllustration />
            </div>
          </div>
        )}

        {/* Form Content Side */}
        <div className="p-4 sm:p-6 md:p-8 flex flex-col justify-center">
          {children}
        </div>

        {/* Desktop Image Side */}
        <div className="hidden md:flex bg-shocking-pink-light/10 items-center justify-center p-6 relative">
          <LoginIllustration />
        </div>
      </Card>
    </main>
  );
}

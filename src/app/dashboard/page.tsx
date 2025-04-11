"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import { LogOut, Settings, Calendar, Users, User, Shield } from "lucide-react";
import LoadingSpinner from "@/components/shared/LoadingSpinner";

export default function DashboardPage() {
  const { user, logout, hasRole, isLoading } = useAuth();
  const router = useRouter();

  // Redirect based on user role
  useEffect(() => {
    if (!isLoading && user) {
      // If user has a specific role, redirect to their dedicated portal
      if (hasRole("business")) {
        router.push("/business");
        return;
      }

      if (hasRole("client")) {
        router.push("/client");
        return;
      }

      // Admin stays at the dashboard to access everything
    }
  }, [user, hasRole, router, isLoading]);

  // Display loading while redirecting
  if (isLoading || (user && !hasRole("admin"))) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
        <span className="ml-3">Redirecting to your portal...</span>
      </div>
    );
  }

  // Only admin should reach this point
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-neutral-lightest via-white to-shocking-pink-light/10">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
            <h1 className="text-xl font-semibold text-text-100">
              Admin Dashboard
            </h1>
            <div className="flex items-center gap-2">
              <div className="text-right mr-4">
                <p className="text-sm font-medium text-text-100">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-text-200">{user?.email}</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => logout()}
                className="flex items-center gap-1"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </Button>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Administrator Role information */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-lg font-medium text-text-100 mb-4 flex items-center">
              <Shield className="h-5 w-5 mr-2 text-accent-200" />
              Administrator Access
            </h2>
            <p className="text-text-200 mb-4">
              As an administrator, you have access to all areas of the
              application. Use the links below to navigate to different portals.
            </p>
            <div className="flex flex-wrap gap-2">
              {user?.roles && user.roles.length > 0 ? (
                user.roles.map((role, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-accent-100/20 text-accent-200 rounded-full text-sm"
                  >
                    {role}
                  </span>
                ))
              ) : (
                <p className="text-text-200">No roles assigned</p>
              )}
            </div>
          </div>

          {/* Portal access cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Business Portal */}
            <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-cinnamon">
              <div className="flex items-start mb-4">
                <div className="p-2 bg-cinnamon/10 rounded-lg mr-4">
                  <Calendar className="h-6 w-6 text-cinnamon" />
                </div>
                <div>
                  <h3 className="font-medium text-text-100">Business Portal</h3>
                  <p className="text-sm text-text-200 mt-1">
                    Manage services, staff, and business operations
                  </p>
                </div>
              </div>
              <Button
                className="w-full bg-cinnamon hover:bg-cinnamon/90 text-white"
                onClick={() => router.push("/business")}
              >
                Access Business Portal
              </Button>
            </div>

            {/* Client Portal */}
            <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-shocking-pink">
              <div className="flex items-start mb-4">
                <div className="p-2 bg-shocking-pink-light/20 rounded-lg mr-4">
                  <User className="h-6 w-6 text-shocking-pink" />
                </div>
                <div>
                  <h3 className="font-medium text-text-100">Client Portal</h3>
                  <p className="text-sm text-text-200 mt-1">
                    Book appointments and view your schedule
                  </p>
                </div>
              </div>
              <Button
                className="w-full bg-shocking-pink hover:bg-shocking-pink-dark text-white"
                onClick={() => router.push("/client")}
              >
                Access Client Portal
              </Button>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}

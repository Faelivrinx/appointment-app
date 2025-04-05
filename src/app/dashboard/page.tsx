"use client";

import { Button } from "@/components/ui/button";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/context/auth-context";
import { LogOut, Settings, Calendar, Users, User, Shield } from "lucide-react";

export default function DashboardPage() {
  const { user, logout } = useAuth();

  console.log("User data:", user);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-neutral-lightest via-white to-shocking-pink-light/10">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
            <h1 className="text-xl font-semibold text-text-100">Dashboard</h1>
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
          {/* Role information */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-lg font-medium text-text-100 mb-4 flex items-center">
              <Shield className="h-5 w-5 mr-2 text-accent-200" />
              Your Roles
            </h2>
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

          {/* Role-based content */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Admin dashboard access - only visible for admin role */}
            {user?.roles.includes("admin") && (
              <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-purple-500">
                <div className="flex items-start mb-4">
                  <div className="p-2 bg-purple-100 rounded-lg mr-4">
                    <Settings className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-text-100">
                      Admin Settings
                    </h3>
                    <p className="text-sm text-text-200 mt-1">
                      Configure system settings and user permissions
                    </p>
                  </div>
                </div>
                <Button
                  className="w-full bg-purple-500 hover:bg-purple-600 text-white"
                  onClick={() => alert("Admin settings would open here")}
                >
                  Manage Settings
                </Button>
              </div>
            )}

            {/* Business dashboard - for business role */}
            {user?.roles.includes("business") && (
              <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-cinnamon">
                <div className="flex items-start mb-4">
                  <div className="p-2 bg-cinnamon/10 rounded-lg mr-4">
                    <Calendar className="h-6 w-6 text-cinnamon" />
                  </div>
                  <div>
                    <h3 className="font-medium text-text-100">
                      Business Dashboard
                    </h3>
                    <p className="text-sm text-text-200 mt-1">
                      Manage appointments and business operations
                    </p>
                  </div>
                </div>
                <Button
                  className="w-full bg-cinnamon hover:bg-cinnamon/90 text-white"
                  onClick={() => alert("Business dashboard would open here")}
                >
                  Business Management
                </Button>
              </div>
            )}

            {/* Client dashboard - for user role */}
            {user?.roles.includes("user") && (
              <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-shocking-pink">
                <div className="flex items-start mb-4">
                  <div className="p-2 bg-shocking-pink-light/20 rounded-lg mr-4">
                    <User className="h-6 w-6 text-shocking-pink" />
                  </div>
                  <div>
                    <h3 className="font-medium text-text-100">
                      My Appointments
                    </h3>
                    <p className="text-sm text-text-200 mt-1">
                      View and manage your appointments
                    </p>
                  </div>
                </div>
                <Button
                  className="w-full bg-shocking-pink hover:bg-shocking-pink-dark text-white"
                  onClick={() => alert("Appointments would open here")}
                >
                  View Appointments
                </Button>
              </div>
            )}

            {/* Generic panel visible to all */}
            <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-accent-200">
              <div className="flex items-start mb-4">
                <div className="p-2 bg-accent-100/20 rounded-lg mr-4">
                  <Users className="h-6 w-6 text-accent-200" />
                </div>
                <div>
                  <h3 className="font-medium text-text-100">User Profile</h3>
                  <p className="text-sm text-text-200 mt-1">
                    Manage your account settings and preferences
                  </p>
                </div>
              </div>
              <Button
                className="w-full bg-accent-200 hover:bg-accent-100 text-white"
                onClick={() => alert("Profile settings would open here")}
              >
                Edit Profile
              </Button>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}

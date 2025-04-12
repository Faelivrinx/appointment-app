"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import {
  Calendar,
  Clock,
  Menu,
  X,
  LogOut,
  User,
  History,
  Home,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import LoadingSpinner from "@/components/shared/LoadingSpinner";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, logout, isLoading } = useAuth();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Check if user has client role

  const menuItems = [
    {
      name: "Dashboard",
      href: "/client",
      icon: <Home className="h-5 w-5 mr-3" />,
    },
    {
      name: "Book Appointment",
      href: "/client/book",
      icon: <Calendar className="h-5 w-5 mr-3" />,
    },
    {
      name: "Upcoming",
      href: "/client/appointments",
      icon: <Clock className="h-5 w-5 mr-3" />,
    },
    {
      name: "History",
      href: "/client/history",
      icon: <History className="h-5 w-5 mr-3" />,
    },
  ];

  const isActive = (href: string) => {
    if (href === "/client") {
      return pathname === "/client";
    }
    return pathname.startsWith(href);
  };

  // Show loading state while checking permissions
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
        <span className="ml-3">Loading...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-neutral-lightest via-white to-shocking-pink-light/10">
      {/* Mobile Header */}
      <header className="lg:hidden bg-white shadow-sm z-10">
        <div className="px-4 py-3 flex justify-between items-center">
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
            <span className="sr-only">Toggle menu</span>
          </Button>
          <div className="font-bold text-text-100">Client Portal</div>
          <div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => logout()}
              className="flex items-center text-text-200"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-md transform ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } lg:translate-x-0 lg:static lg:inset-auto transition-transform duration-300 ease-in-out`}
        >
          <div className="h-full flex flex-col">
            <div className="p-4 border-b hidden lg:block">
              <h1 className="text-xl font-bold text-text-100">Client Portal</h1>
            </div>

            {/* User info */}
            <div className="p-4 border-b">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-shocking-pink-light/50 flex items-center justify-center">
                    <User className="h-5 w-5 text-shocking-pink" />
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-text-100">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-xs text-text-200 truncate">
                    {user?.email}
                  </p>
                </div>
              </div>
            </div>

            {/* Menu items */}
            <nav className="flex-1 p-4 space-y-1">
              {menuItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center px-2 py-2 text-base rounded-md ${
                    isActive(item.href)
                      ? "bg-shocking-pink-light/20 text-shocking-pink font-medium"
                      : "text-text-200 hover:bg-bg-200"
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  {item.icon}
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* Logout button (mobile only shows in sidebar) */}
            <div className="p-4 border-t lg:hidden">
              <Button
                variant="ghost"
                className="w-full flex items-center justify-center"
                onClick={() => logout()}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}

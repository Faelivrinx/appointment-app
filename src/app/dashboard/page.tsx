"use client";

import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <p>Im logged in!</p>
    </ProtectedRoute>
  );
}

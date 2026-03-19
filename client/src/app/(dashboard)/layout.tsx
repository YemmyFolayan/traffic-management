"use client";

import { AuthGuard } from "@/components/auth-guard";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { DashboardHeader } from "@/components/dashboard/header";
import { ErrorBoundary } from "@/components/error-boundary";
import { useState } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <AuthGuard>
      <div className="min-h-screen bg-muted/30">
        <DashboardSidebar
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        <div className="lg:pl-64">
          <DashboardHeader onMenuClick={() => setSidebarOpen(true)} />
          <main className="p-4 md:p-6 lg:p-8">
            <ErrorBoundary>{children}</ErrorBoundary>
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}

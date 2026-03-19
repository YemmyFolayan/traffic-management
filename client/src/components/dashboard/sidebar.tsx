"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Brain,
  GitBranch,
  LayoutDashboard,
  Map,
  Play,
  Settings,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/auth-store";

const nav = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/traffic-map", label: "Traffic Map", icon: Map },
  { href: "/dashboard/intersections", label: "Intersections", icon: GitBranch },
  { href: "/dashboard/simulation", label: "Simulation", icon: Play },
  { href: "/dashboard/model", label: "DRL Model", icon: Brain },
  { href: "/dashboard/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
] as const;

export function DashboardSidebar({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);

  return (
    <>
      <div
        className={cn(
          "fixed inset-0 z-40 bg-background/80 backdrop-blur-sm transition-opacity lg:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        aria-hidden={!open}
        onClick={onClose}
      />
      <aside
        className={cn(
          "fixed left-0 top-0 z-50 flex h-full w-64 flex-col border-r border-border bg-sidebar text-sidebar-foreground shadow-sm transition-transform duration-300 ease-out",
          "lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-border px-4">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 font-semibold tracking-tight transition-opacity hover:opacity-90"
            onClick={onClose}
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">
              IT
            </span>
            <span className="text-foreground">ITMS</span>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={onClose}
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          {nav.map((item) => {
            const Icon = item.icon;
            const active =
              item.href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-sidebar-accent text-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-sidebar-accent/70 hover:text-foreground",
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-border p-4">
          <p className="mb-2 text-xs font-medium text-muted-foreground">
            Signed in as
          </p>
          <p className="truncate text-sm font-medium">{user?.name ?? "—"}</p>
          <p className="truncate text-xs text-muted-foreground">{user?.email}</p>
          <div className="mt-3">
            <Badge variant="secondary" className="font-normal">
              {user?.role ?? "—"}
            </Badge>
          </div>
        </div>
      </aside>
    </>
  );
}

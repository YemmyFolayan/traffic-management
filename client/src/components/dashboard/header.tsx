"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, Menu, Settings, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuthStore } from "@/store/auth-store";
import { Badge } from "@/components/ui/badge";

const TITLE_MAP: Record<string, string> = {
  "/dashboard": "Overview",
  "/dashboard/traffic-map": "Traffic Map",
  "/dashboard/intersections": "Intersections",
  "/dashboard/simulation": "Simulation",
  "/dashboard/model": "DRL Model",
  "/dashboard/analytics": "Analytics",
  "/dashboard/settings": "Settings",
};

function getTitle(pathname: string): string {
  if (TITLE_MAP[pathname]) return TITLE_MAP[pathname];
  const prefix = Object.keys(TITLE_MAP)
    .filter((k) => k !== "/dashboard")
    .find((k) => pathname.startsWith(k));
  return prefix ? TITLE_MAP[prefix] : "Dashboard";
}

export function DashboardHeader({ onMenuClick }: { onMenuClick: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const isDemoSession = useAuthStore((s) => s.isDemoSession);
  const logout = useAuthStore((s) => s.logout);

  const initials =
    user?.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() ?? "?";

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-border bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/80 md:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={onMenuClick}
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </Button>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="truncate text-lg font-semibold tracking-tight md:text-xl">
              {getTitle(pathname)}
            </h1>
            {isDemoSession && (
              <Badge
                variant="outline"
                className="shrink-0 border-amber-500/40 font-normal text-xs text-amber-800 dark:text-amber-400"
              >
                Demo Mode
              </Badge>
            )}
          </div>
          <p className="hidden text-sm text-muted-foreground sm:block">
            Intelligent Traffic Management System
          </p>
        </div>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="relative h-10 gap-2 rounded-full px-2"
          >
            <Avatar className="h-9 w-9">
              <AvatarFallback className="bg-primary/10 text-sm font-medium text-primary">
                {initials}
              </AvatarFallback>
            </Avatar>
            <span className="hidden max-w-[140px] truncate text-left text-sm font-medium md:inline">
              {user?.name}
            </span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{user?.name}</p>
              <p className="text-xs leading-none text-muted-foreground">
                {user?.email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/dashboard/settings" className="cursor-pointer">
              <User className="mr-2 h-4 w-4" />
              Profile
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/dashboard/settings" className="cursor-pointer">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="cursor-pointer text-destructive focus:text-destructive"
            onClick={() => {
              logout();
              router.replace("/");
            }}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}

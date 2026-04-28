"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuthStore } from "@/store/auth-store";
import { isDemoMode } from "@/lib/demo-mode";
import { toast } from "@/hooks/use-toast";
import {
  Activity,
  ChevronRight,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  Shield,
  Settings,
  BarChart3,
} from "lucide-react";

function getErrorMessage(err: unknown, fallback: string): string {
  if (err instanceof Error) return err.message;
  return fallback;
}

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const login = useAuthStore((s) => s.login);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast({ title: "Credentials verified", description: "Please complete passphrase verification." });
      router.push("/verify-passphrase");
    } catch (err: unknown) {
      const message = getErrorMessage(err, "Invalid credentials");
      toast({
        variant: "destructive",
        title: "Sign in failed",
        description: message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-3">
        <Link
          href="/"
          className="inline-flex flex-col items-center gap-3 group"
        >
          <div className="relative">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 opacity-20 blur-xl scale-110" />
            <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 shadow-lg shadow-blue-500/25 ring-2 ring-white/60">
              <Activity className="h-7 w-7 text-white" strokeWidth={2.25} />
            </div>
          </div>
          <div>
            <span className="text-2xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
              ITMS
            </span>
            <p className="text-sm text-muted-foreground mt-1 font-medium">
              Intelligent Traffic Management System
            </p>
          </div>
        </Link>
      </div>

      <Card className="border-0 shadow-xl shadow-indigo-950/10 bg-white/80 backdrop-blur-sm ring-1 ring-slate-200/80">
        <CardHeader className="space-y-1 pb-2 text-center">
          <CardTitle className="text-2xl font-semibold tracking-tight">
            Welcome back
          </CardTitle>
          <CardDescription>
            Sign in with your work email to manage traffic simulations.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-5 pt-2">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email
              </Label>
              <div className="relative">
                <Mail
                  className="pointer-events-none absolute left-3 top-1/2 z-[1] h-4 w-4 -translate-y-1/2 text-muted-foreground"
                  aria-hidden
                />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@organization.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  className="pl-10 h-11"
                  disabled={loading}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">
                Password
              </Label>
              <div className="relative">
                <Lock
                  className="pointer-events-none absolute left-3 top-1/2 z-[1] h-4 w-4 -translate-y-1/2 text-muted-foreground"
                  aria-hidden
                />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  className="pl-10 pr-11 h-11"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 z-[1] -translate-y-1/2 rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-5 pt-2 pb-6">
            <Button
              type="submit"
              className="w-full h-11 text-base font-semibold shadow-md shadow-blue-600/20"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in…
                </>
              ) : (
                "Sign In"
              )}
            </Button>
            <p className="text-sm text-muted-foreground text-center leading-relaxed">
              Don&apos;t have an account?{" "}
              <Link
                href="/register"
                className="inline-flex items-center gap-0.5 font-semibold text-primary hover:underline underline-offset-4"
              >
                Create account
                <ChevronRight className="h-4 w-4" />
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>

      {isDemoMode() && (
        <div className="space-y-3">
          <div className="flex items-center justify-center gap-2">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-300 to-transparent" />
            <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Quick access
            </span>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-300 to-transparent" />
          </div>

          <div className="grid grid-cols-3 gap-2.5">
            {[
              {
                label: "Admin",
                desc: "Full access",
                email: "admin@itms.com",
                pw: "admin123",
                icon: Shield,
                gradient: "from-rose-500 to-orange-500",
                shadow: "shadow-rose-500/20",
                ring: "ring-rose-200",
                bg: "bg-rose-50",
                text: "text-rose-700",
              },
              {
                label: "Operator",
                desc: "Manage traffic",
                email: "operator@itms.com",
                pw: "operator123",
                icon: Settings,
                gradient: "from-blue-500 to-cyan-500",
                shadow: "shadow-blue-500/20",
                ring: "ring-blue-200",
                bg: "bg-blue-50",
                text: "text-blue-700",
              },
              {
                label: "Viewer",
                desc: "Read-only",
                email: "viewer@itms.com",
                pw: "viewer123",
                icon: BarChart3,
                gradient: "from-emerald-500 to-teal-500",
                shadow: "shadow-emerald-500/20",
                ring: "ring-emerald-200",
                bg: "bg-emerald-50",
                text: "text-emerald-700",
              },
            ].map((d) => {
              const Icon = d.icon;
              const isActive = email === d.email;
              return (
                <button
                  key={d.email}
                  type="button"
                  onClick={() => {
                    setEmail(d.email);
                    setPassword(d.pw);
                  }}
                  className={`group relative flex flex-col items-center gap-2 rounded-xl border p-4 text-center transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg ${d.shadow} ${
                    isActive
                      ? `border-transparent ring-2 ${d.ring} ${d.bg}`
                      : "border-slate-200/80 bg-white/80 hover:border-slate-300"
                  }`}
                >
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${d.gradient} shadow-md ${d.shadow} transition-transform duration-200 group-hover:scale-110`}
                  >
                    <Icon className="h-5 w-5 text-white" strokeWidth={2} />
                  </div>
                  <div>
                    <p className={`text-sm font-semibold ${isActive ? d.text : "text-slate-800"}`}>
                      {d.label}
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      {d.desc}
                    </p>
                  </div>
                  {isActive && (
                    <div className={`absolute -top-1 -right-1 h-3 w-3 rounded-full bg-gradient-to-br ${d.gradient} ring-2 ring-white`} />
                  )}
                </button>
              );
            })}
          </div>

          <p className="text-center text-[11px] text-muted-foreground/70">
            Tap a role above to auto-fill credentials, then sign in.
          </p>
        </div>
      )}
    </div>
  );
}

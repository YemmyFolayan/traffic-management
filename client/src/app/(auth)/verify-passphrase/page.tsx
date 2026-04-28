"use client";

import { useEffect, useState } from "react";
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
import { getDemoPassphrase } from "@/lib/passphrase";
import { isDemoMode } from "@/lib/demo-mode";
import { toast } from "@/hooks/use-toast";
import {
  Activity,
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
  ShieldCheck,
  Info,
} from "lucide-react";

export default function VerifyPassphrasePage() {
  const router = useRouter();
  const {
    user,
    isAuthenticated,
    isPassphraseVerified,
    needsPassphraseSetup,
    verifyPassphrase,
    setupPassphrase,
    isLoading: authLoading,
  } = useAuthStore();

  const [passphrase, setPassphrase] = useState("");
  const [confirmPassphrase, setConfirmPassphrase] = useState("");
  const [showPassphrase, setShowPassphrase] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [attempts, setAttempts] = useState(0);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    if (isAuthenticated && isPassphraseVerified) {
      router.replace("/dashboard");
    }
  }, [isAuthenticated, isPassphraseVerified, router]);

  if (authLoading || !isAuthenticated || isPassphraseVerified) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  const demoHint =
    isDemoMode() && user ? getDemoPassphrase(user.email) : undefined;

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passphrase.trim()) return;

    setLoading(true);
    try {
      const valid = await verifyPassphrase(passphrase);
      if (valid) {
        toast({
          title: "Verified",
          description: "Passphrase accepted. Welcome back!",
        });
        router.push("/dashboard");
      } else {
        const newAttempts = attempts + 1;
        setAttempts(newAttempts);
        toast({
          variant: "destructive",
          title: "Invalid passphrase",
          description:
            newAttempts >= 3
              ? "Multiple failed attempts. Please verify your passphrase carefully."
              : "The passphrase you entered is incorrect.",
        });
        setPassphrase("");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passphrase.trim()) return;

    if (passphrase.length < 6) {
      toast({
        variant: "destructive",
        title: "Too short",
        description: "Your passphrase must be at least 6 characters.",
      });
      return;
    }

    if (passphrase !== confirmPassphrase) {
      toast({
        variant: "destructive",
        title: "Mismatch",
        description: "Passphrases do not match. Please try again.",
      });
      return;
    }

    setLoading(true);
    try {
      await setupPassphrase(passphrase);
      toast({
        title: "Passphrase created",
        description:
          "Your passphrase has been set. You will need it for future logins.",
      });
      router.push("/dashboard");
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
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-amber-100 to-orange-100 ring-1 ring-amber-200">
            {needsPassphraseSetup ? (
              <KeyRound className="h-6 w-6 text-amber-600" />
            ) : (
              <ShieldCheck className="h-6 w-6 text-amber-600" />
            )}
          </div>
          <CardTitle className="text-2xl font-semibold tracking-tight">
            {needsPassphraseSetup
              ? "Set Up Your Passphrase"
              : "Two-Factor Verification"}
          </CardTitle>
          <CardDescription>
            {needsPassphraseSetup
              ? "Create a secure passphrase for two-factor authentication. You'll need this each time you sign in."
              : `Enter your passphrase to continue as ${user?.name ?? "user"}.`}
          </CardDescription>
        </CardHeader>

        <form onSubmit={needsPassphraseSetup ? handleSetup : handleVerify}>
          <CardContent className="space-y-5 pt-2">
            <div className="space-y-2">
              <Label htmlFor="passphrase" className="text-sm font-medium">
                {needsPassphraseSetup ? "New Passphrase" : "Passphrase"}
              </Label>
              <div className="relative">
                <KeyRound
                  className="pointer-events-none absolute left-3 top-1/2 z-[1] h-4 w-4 -translate-y-1/2 text-muted-foreground"
                  aria-hidden
                />
                <Input
                  id="passphrase"
                  type={showPassphrase ? "text" : "password"}
                  placeholder={
                    needsPassphraseSetup
                      ? "Enter a memorable passphrase"
                      : "Enter your passphrase"
                  }
                  value={passphrase}
                  onChange={(e) => setPassphrase(e.target.value)}
                  required
                  autoFocus
                  autoComplete="off"
                  className="pl-10 pr-11 h-11"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassphrase(!showPassphrase)}
                  className="absolute right-3 top-1/2 z-[1] -translate-y-1/2 rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  aria-label={
                    showPassphrase ? "Hide passphrase" : "Show passphrase"
                  }
                >
                  {showPassphrase ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {needsPassphraseSetup && (
              <div className="space-y-2">
                <Label
                  htmlFor="confirmPassphrase"
                  className="text-sm font-medium"
                >
                  Confirm Passphrase
                </Label>
                <div className="relative">
                  <KeyRound
                    className="pointer-events-none absolute left-3 top-1/2 z-[1] h-4 w-4 -translate-y-1/2 text-muted-foreground"
                    aria-hidden
                  />
                  <Input
                    id="confirmPassphrase"
                    type={showConfirm ? "text" : "password"}
                    placeholder="Re-enter your passphrase"
                    value={confirmPassphrase}
                    onChange={(e) => setConfirmPassphrase(e.target.value)}
                    required
                    autoComplete="off"
                    className="pl-10 pr-11 h-11"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-1/2 z-[1] -translate-y-1/2 rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    aria-label={
                      showConfirm ? "Hide passphrase" : "Show passphrase"
                    }
                  >
                    {showConfirm ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Minimum 6 characters. Use a phrase that is easy for you to
                  remember but hard for others to guess.
                </p>
              </div>
            )}

            {!needsPassphraseSetup && attempts >= 3 && (
              <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
                <Info className="mt-0.5 h-4 w-4 shrink-0" />
                <span>
                  Multiple failed attempts detected. Make sure you&apos;re
                  entering the correct passphrase.
                </span>
              </div>
            )}
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
                  {needsPassphraseSetup ? "Setting up…" : "Verifying…"}
                </>
              ) : needsPassphraseSetup ? (
                "Create Passphrase & Continue"
              ) : (
                "Verify & Continue"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>

      {demoHint && (
        <div className="space-y-3">
          <div className="flex items-center justify-center gap-2">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-300 to-transparent" />
            <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Demo hint
            </span>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-300 to-transparent" />
          </div>

          <button
            type="button"
            onClick={() => {
              setPassphrase(demoHint);
              if (needsPassphraseSetup) setConfirmPassphrase(demoHint);
            }}
            className="mx-auto flex items-center gap-2 rounded-xl border border-slate-200/80 bg-white/80 px-4 py-3 text-sm transition-all hover:-translate-y-0.5 hover:shadow-md hover:border-slate-300"
          >
            <KeyRound className="h-4 w-4 text-amber-500" />
            <span className="text-muted-foreground">
              Passphrase:{" "}
              <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-xs text-slate-700">
                {demoHint}
              </code>
            </span>
          </button>

          <p className="text-center text-[11px] text-muted-foreground/70">
            Tap above to auto-fill the demo passphrase.
          </p>
        </div>
      )}
    </div>
  );
}

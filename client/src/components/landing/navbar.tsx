"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Activity, Menu, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/#about", label: "About" },
  { href: "/#features", label: "Features" },
  { href: "/#methodology", label: "Methodology" },
  { href: "/#results", label: "Results" },
  { href: "/#researchers", label: "Researchers" },
] as const;

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) setOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 z-50 w-full border-b transition-all duration-300",
        scrolled
          ? "border-border/50 bg-background/80 shadow-md shadow-black/[0.03] backdrop-blur-xl backdrop-saturate-150 dark:shadow-black/20"
          : "border-transparent bg-background/[0.45] shadow-none backdrop-blur-xl backdrop-saturate-150 supports-[backdrop-filter]:bg-background/30"
      )}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="group flex items-center gap-2 rounded-md outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
        >
          <span
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-lg border shadow-sm transition-colors",
              scrolled
                ? "border-border/80 bg-primary/10 text-primary"
                : "border-white/25 bg-white/10 text-primary backdrop-blur-sm dark:border-white/10 dark:bg-white/5"
            )}
          >
            <Activity className="h-5 w-5" aria-hidden />
          </span>
          <span className="text-sm font-semibold tracking-tight sm:text-base">
            ITMS
          </span>
        </Link>

        <nav
          className="hidden items-center gap-1 md:flex"
          aria-label="Primary"
        >
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent/60 hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/login">Login</Link>
          </Button>
          <Button size="sm" asChild>
            <Link href="/register">Register</Link>
          </Button>
        </div>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-border/60 bg-background/50 text-foreground shadow-sm backdrop-blur-sm md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-nav"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          <span className="sr-only">Toggle menu</span>
        </button>
      </div>

      <div
        id="mobile-nav"
        className={cn(
          "border-t border-border/40 bg-background/95 backdrop-blur-xl md:hidden",
          open ? "max-h-[320px] opacity-100" : "max-h-0 overflow-hidden opacity-0"
        )}
      >
        <div className="flex flex-col gap-1 px-4 py-3">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-md px-3 py-2.5 text-sm font-medium text-foreground hover:bg-accent/70"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <div className="mt-2 flex flex-col gap-2 border-t border-border/50 pt-3">
            <Button variant="outline" asChild className="w-full">
              <Link href="/login" onClick={() => setOpen(false)}>
                Login
              </Link>
            </Button>
            <Button asChild className="w-full">
              <Link href="/register" onClick={() => setOpen(false)}>
                Register
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}

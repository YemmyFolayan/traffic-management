import Link from "next/link";
import { Activity } from "lucide-react";

const footerLinks = [
  { href: "/", label: "Home" },
  { href: "/#about", label: "About" },
  { href: "/#features", label: "Features" },
  { href: "/#results", label: "Results" },
  { href: "/about", label: "Research" },
] as const;

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border/60 bg-muted/20">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div className="max-w-md">
            <Link href="/" className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-border/60 bg-primary/10 text-primary">
                <Activity className="h-5 w-5" aria-hidden />
              </span>
              <span className="text-base font-semibold tracking-tight">
                ITMS
              </span>
            </Link>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Intelligent Traffic Management System — research on deep
              reinforcement learning for urban traffic signal optimization.
            </p>
            <p className="mt-4 text-sm font-medium text-foreground">
              Federal University of Technology, Akure (FUTA)
            </p>
          </div>

          <div>
            <p className="text-sm font-semibold text-foreground">Explore</p>
            <ul className="mt-3 space-y-2">
              {footerLinks.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-border/50 pt-8 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} ITMS Research Project. All rights reserved.</p>
          <p className="text-muted-foreground/90">
            Built for academic research — not a commercial offering.
          </p>
        </div>
      </div>
    </footer>
  );
}

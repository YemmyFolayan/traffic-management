"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-24 pb-16 sm:pb-20 lg:pb-28">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.07] via-background to-secondary/40" />
        <div
          className="absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, hsl(var(--border)) 1px, transparent 0)`,
            backgroundSize: "28px 28px",
          }}
        />
        <div className="absolute -right-24 top-20 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -left-16 bottom-0 h-64 w-64 rounded-full bg-secondary/50 blur-3xl" />
      </div>

      <div className="mx-auto grid max-w-6xl gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:items-center lg:gap-16 lg:px-8">
        <div>
          <p className="mb-3 inline-flex items-center rounded-full border border-border/60 bg-card/60 px-3 py-1 text-xs font-medium text-muted-foreground shadow-sm backdrop-blur-sm">
            FUTA Research · Deep Reinforcement Learning
          </p>
          <h1 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            Intelligent Traffic Management System
          </h1>
          <p className="mt-4 text-lg text-muted-foreground sm:text-xl">
            Optimizing urban traffic flow with deep reinforcement learning —
            adaptive signal control that learns from real-world congestion
            patterns.
          </p>
          <div
            id="about"
            className="mt-6 scroll-mt-28 space-y-4 text-pretty text-sm leading-relaxed text-muted-foreground sm:text-base"
          >
            <p>
              This research develops an Intelligent Traffic Management System
              (ITMS) that applies Deep Q-Learning and simulation-based training
              to reduce delays, improve throughput, and lower emissions across
              urban intersections.
            </p>
          </div>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button size="lg" className="gap-2" asChild>
              <Link href="/dashboard">
                View Dashboard
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href="#features">Learn More</a>
            </Button>
          </div>
        </div>

        <div className="flex justify-center lg:justify-end">
          <div className="relative w-full max-w-sm rounded-2xl border border-border/60 bg-card/50 p-8 shadow-lg shadow-primary/5 backdrop-blur-md">
            <p className="mb-6 text-center text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Signal state (simulation)
            </p>
            <TrafficSignalVisual />
            <p className="mt-6 text-center text-xs text-muted-foreground">
              CSS-animated phases illustrating red, yellow, and green timing.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function TrafficSignalVisual() {
  return (
    <div className="mx-auto flex w-40 flex-col items-center gap-4">
      <div
        className="flex flex-col items-center gap-3 rounded-2xl border border-border/80 bg-gradient-to-b from-muted/80 to-muted/30 px-6 py-8 shadow-inner"
        role="img"
        aria-label="Animated traffic signal: red, yellow, and green phases"
      >
        <div className="flex h-14 w-14 items-center justify-center rounded-full border border-border/50 bg-background/40">
          <span
            className={cn(
              "h-10 w-10 rounded-full border border-black/5 bg-traffic-red",
              "animate-traffic-red"
            )}
          />
        </div>
        <div className="flex h-14 w-14 items-center justify-center rounded-full border border-border/50 bg-background/40">
          <span
            className={cn(
              "h-10 w-10 rounded-full border border-black/5 bg-traffic-yellow",
              "animate-traffic-yellow"
            )}
          />
        </div>
        <div className="flex h-14 w-14 items-center justify-center rounded-full border border-border/50 bg-background/40">
          <span
            className={cn(
              "h-10 w-10 rounded-full border border-black/5 bg-traffic-green",
              "animate-traffic-green"
            )}
          />
        </div>
      </div>
      <div className="h-16 w-3 rounded-b-md bg-muted-foreground/25" aria-hidden />
    </div>
  );
}

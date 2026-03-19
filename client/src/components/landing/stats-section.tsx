"use client";

import { useEffect, useRef, useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FadeInView } from "@/components/landing/fade-in-view";
import { cn } from "@/lib/utils";

const stats = [
  { value: 37.7, suffix: "%", label: "Reduction in Avg. Delay" },
  { value: 30.1, suffix: "%", label: "Improvement in Throughput" },
  { value: 16.8, suffix: "%", label: "Lower CO₂ Emissions" },
  { value: 80.8, suffix: "%", label: "Reduction in Emergency Wait" },
] as const;

const comparisons = [
  {
    metric: "Avg. Delay (s)",
    fixedLabel: "Static: 125.6s",
    drlLabel: "ITMS: 78.3s",
    fixed: 100,
    drl: 62,
  },
  {
    metric: "Throughput (veh/h)",
    fixedLabel: "Static: 452",
    drlLabel: "ITMS: 588",
    fixed: 77,
    drl: 100,
  },
  {
    metric: "CO₂ Emissions (kg/h)",
    fixedLabel: "Static: 210.5",
    drlLabel: "ITMS: 175.2",
    fixed: 100,
    drl: 83,
  },
  {
    metric: "Emergency Wait (s)",
    fixedLabel: "Static: 45.2s",
    drlLabel: "ITMS: 8.7s",
    fixed: 100,
    drl: 19,
  },
] as const;

function useCountUp(target: number, enabled: boolean, durationMs = 1400) {
  const [n, setN] = useState(0);
  const hasDecimal = target % 1 !== 0;

  useEffect(() => {
    if (!enabled) return;
    let raf = 0;
    const start = performance.now();

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / durationMs);
      const eased = 1 - (1 - t) ** 3;
      const raw = target * eased;
      setN(hasDecimal ? Math.round(raw * 10) / 10 : Math.round(raw));
      if (t < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [enabled, target, durationMs, hasDecimal]);

  return n;
}

function StatCard({
  value,
  suffix,
  label,
  animate,
}: {
  value: number;
  suffix: string;
  label: string;
  animate: boolean;
}) {
  const display = useCountUp(value, animate);
  return (
    <Card className="border-border/60 bg-card/90 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-4xl font-bold tracking-tight text-primary sm:text-5xl">
          {display}
          {suffix}
        </CardTitle>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">{label}</CardContent>
    </Card>
  );
}

export function StatsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) setVisible(true);
      },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      id="results"
      ref={ref}
      className="scroll-mt-24 bg-gradient-to-b from-background to-muted/25 py-16 sm:py-20"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <FadeInView className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Research Results
          </h2>
          <p className="mt-3 text-pretty text-muted-foreground sm:text-lg">
            Average results from 30 independent SUMO simulation runs (3600s
            each) comparing the ITMS against a validated static timing baseline.
          </p>
        </FadeInView>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s) => (
            <FadeInView key={s.label}>
              <StatCard
                value={s.value}
                suffix={s.suffix}
                label={s.label}
                animate={visible}
              />
            </FadeInView>
          ))}
        </div>

        <FadeInView className="mt-14">
          <div className="rounded-xl border border-border/60 bg-card/70 p-6 shadow-sm backdrop-blur-sm sm:p-8">
            <h3 className="text-lg font-semibold tracking-tight">
              Static System vs ITMS (DQN-Optimized)
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Bars show relative performance. Lower is better for delay,
              emissions, and emergency wait. Higher is better for throughput.
            </p>
            <div className="mt-8 space-y-6">
              {comparisons.map((row) => (
                <div key={row.metric}>
                  <p className="mb-2 text-sm font-medium text-foreground">
                    {row.metric}
                  </p>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <BarCompare
                      label={row.fixedLabel}
                      value={row.fixed}
                      tone="muted"
                      animate={visible}
                    />
                    <BarCompare
                      label={row.drlLabel}
                      value={row.drl}
                      tone="primary"
                      animate={visible}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </FadeInView>
      </div>
    </section>
  );
}

function BarCompare({
  label,
  value,
  tone,
  animate,
}: {
  label: string;
  value: number;
  tone: "muted" | "primary";
  animate: boolean;
}) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-xs text-muted-foreground">
        <span>{label}</span>
        <span>{value}%</span>
      </div>
      <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted">
        <div
          className={cn(
            "h-full rounded-full transition-[width] duration-[900ms] ease-out",
            tone === "primary"
              ? "bg-primary shadow-sm"
              : "bg-muted-foreground/35"
          )}
          style={{ width: animate ? `${value}%` : "0%" }}
        />
      </div>
    </div>
  );
}

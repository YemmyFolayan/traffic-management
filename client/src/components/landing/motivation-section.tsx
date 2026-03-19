"use client";

import { AlertTriangle, DollarSign, Siren, Blocks } from "lucide-react";

import { FadeInView } from "@/components/landing/fade-in-view";

const motivations = [
  {
    title: "Inadaptability of Conventional Systems",
    description:
      "Existing traffic management systems predominantly rely on fixed-time and actuated signal control, unable to respond effectively to real-time and stochastic traffic variations.",
    icon: AlertTriangle,
  },
  {
    title: "High Infrastructure Costs",
    description:
      "Many intelligent traffic systems utilize high-cost sensing infrastructure such as loop detectors and proprietary hardware, limiting deployment in resource-constrained environments.",
    icon: DollarSign,
  },
  {
    title: "Lack of Emergency Prioritization",
    description:
      "Several recent works optimize traffic flow but do not explicitly integrate emergency vehicle prioritization into the learning framework, limiting real-world applicability.",
    icon: Siren,
  },
  {
    title: "Architectural Rigidity",
    description:
      "Most current approaches emphasize algorithmic performance without providing a modular and transferable system architecture adaptable across different cities.",
    icon: Blocks,
  },
] as const;

export function MotivationSection() {
  return (
    <section className="bg-background py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <FadeInView className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Research Motivation
          </h2>
          <p className="mt-3 text-pretty text-muted-foreground sm:text-lg">
            Key limitations in existing traffic management approaches that
            motivate this research.
          </p>
        </FadeInView>

        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {motivations.map((m, i) => (
            <FadeInView key={m.title}>
              <div className="flex h-full gap-4 rounded-2xl border border-border/60 bg-card/70 p-6 shadow-sm transition-colors hover:border-primary/20">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-border/60 bg-primary/5 text-primary">
                  <m.icon className="h-5 w-5" aria-hidden />
                </span>
                <div>
                  <h3 className="text-base font-semibold tracking-tight text-foreground">
                    {m.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {m.description}
                  </p>
                </div>
              </div>
            </FadeInView>
          ))}
        </div>

        <FadeInView className="mt-10">
          <div className="rounded-xl border border-border/60 bg-card/70 p-6 shadow-sm backdrop-blur-sm sm:p-8">
            <h3 className="text-lg font-semibold tracking-tight">
              Research Aim &amp; Objectives
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              The aim of this research is to develop an Intelligent Traffic
              Management System model using deep learning to address the
              challenges of urban congestion and road safety.
            </p>
            <ul className="mt-4 space-y-3">
              <li className="flex gap-2 text-sm leading-relaxed text-muted-foreground">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                Develop an ITMS model using deep reinforcement learning to
                optimize urban traffic flow.
              </li>
              <li className="flex gap-2 text-sm leading-relaxed text-muted-foreground">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                Evaluate the system&apos;s performance in reducing congestion and
                waiting time, while improving road safety under dynamic traffic
                conditions.
              </li>
            </ul>
          </div>
        </FadeInView>
      </div>
    </section>
  );
}

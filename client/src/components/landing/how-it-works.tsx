"use client";

import { ArrowDown, ArrowRight, Brain, Radio, Zap } from "lucide-react";

import { FadeInView } from "@/components/landing/fade-in-view";

const steps = [
  {
    n: "01",
    title: "Observe",
    description: "Traffic sensors collect real-time data on queues, speeds, and arrivals.",
    icon: Radio,
  },
  {
    n: "02",
    title: "Decide",
    description:
      "The DRL agent analyzes the state and chooses the optimal signal action.",
    icon: Brain,
  },
  {
    n: "03",
    title: "Act",
    description: "Signal timings are adjusted dynamically to improve traffic flow.",
    icon: Zap,
  },
] as const;

export function HowItWorks() {
  return (
    <section className="border-y border-border/50 bg-background py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <FadeInView className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            How It Works
          </h2>
          <p className="mt-3 text-pretty text-muted-foreground sm:text-lg">
            A closed-loop pipeline from sensing to action — optimized with deep
            reinforcement learning.
          </p>
        </FadeInView>

        <div className="mt-14 flex flex-col gap-4 lg:flex-row lg:items-stretch lg:gap-3">
          {steps.map((step, i) => (
            <div key={step.title} className="contents">
              <FadeInView className="flex flex-1">
                <div className="flex h-full w-full flex-col rounded-2xl border border-border/60 bg-card/70 p-6 shadow-sm transition-colors hover:border-primary/20">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                      Step {step.n}
                    </span>
                    <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-border/60 bg-primary/5 text-primary">
                      <step.icon className="h-5 w-5" aria-hidden />
                    </span>
                  </div>
                  <h3 className="mt-4 text-xl font-semibold tracking-tight">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-pretty text-sm leading-relaxed text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              </FadeInView>

              {i < steps.length - 1 ? (
                <>
                  <div
                    className="flex justify-center py-1 text-muted-foreground/45 lg:hidden"
                    aria-hidden
                  >
                    <ArrowDown className="h-6 w-6" />
                  </div>
                  <div
                    className="hidden w-10 shrink-0 items-center justify-center text-muted-foreground/40 lg:flex"
                    aria-hidden
                  >
                    <ArrowRight className="h-6 w-6" />
                  </div>
                </>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

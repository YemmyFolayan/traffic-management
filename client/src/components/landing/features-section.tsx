"use client";

import {
  Activity,
  BarChart3,
  Brain,
  GitBranch,
  Radar,
  SlidersHorizontal,
} from "lucide-react";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FadeInView } from "@/components/landing/fade-in-view";

const features = [
  {
    title: "Deep Reinforcement Learning",
    description: "AI-powered signal optimization using Q-learning.",
    icon: Brain,
  },
  {
    title: "Real-time Monitoring",
    description: "Live traffic flow visualization and metrics.",
    icon: Activity,
  },
  {
    title: "Adaptive Signal Control",
    description: "Dynamic signal timing based on traffic conditions.",
    icon: SlidersHorizontal,
  },
  {
    title: "Performance Analytics",
    description: "Comprehensive traffic analysis and reporting.",
    icon: BarChart3,
  },
  {
    title: "Multi-Intersection Management",
    description: "Coordinated control across intersections.",
    icon: GitBranch,
  },
  {
    title: "Simulation Environment",
    description: "Test scenarios before deployment.",
    icon: Radar,
  },
] as const;

export function FeaturesSection() {
  return (
    <section
      id="features"
      className="scroll-mt-24 border-y border-border/50 bg-muted/20 py-16 sm:py-20"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <FadeInView className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Key Features
          </h2>
          <p className="mt-3 text-pretty text-muted-foreground sm:text-lg">
            End-to-end capabilities for learning, evaluating, and operating an
            intelligent traffic stack.
          </p>
        </FadeInView>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <FadeInView key={f.title}>
              <Card className="group h-full border-border/60 bg-card/80 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/25 hover:shadow-md">
                <CardHeader>
                  <span className="mb-2 inline-flex h-11 w-11 items-center justify-center rounded-lg border border-border/60 bg-primary/5 text-primary transition-colors group-hover:bg-primary/10">
                    <f.icon className="h-5 w-5" aria-hidden />
                  </span>
                  <CardTitle className="text-lg">{f.title}</CardTitle>
                  <CardDescription className="text-pretty leading-relaxed">
                    {f.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            </FadeInView>
          ))}
        </div>
      </div>
    </section>
  );
}

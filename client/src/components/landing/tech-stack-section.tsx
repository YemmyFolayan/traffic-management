"use client";

import { Badge } from "@/components/ui/badge";
import { FadeInView } from "@/components/landing/fade-in-view";

const stack = [
  { name: "SUMO", blurb: "Traffic simulation" },
  { name: "TensorFlow / Keras", blurb: "DQN model training" },
  { name: "YOLOv8", blurb: "Vehicle detection" },
  { name: "Python", blurb: "RL & data pipeline" },
  { name: "Raspberry Pi 4", blurb: "Edge inference nodes" },
  { name: "Next.js / React", blurb: "Dashboard UI" },
  { name: "NestJS", blurb: "Backend APIs" },
  { name: "Socket.IO", blurb: "Real-time comms" },
  { name: "Google Maps", blurb: "Geographic visualization" },
  { name: "PostgreSQL", blurb: "Persistent data" },
  { name: "AWS", blurb: "Cloud deployment" },
  { name: "Deep Q-Network", blurb: "RL optimization" },
] as const;

export function TechStackSection() {
  return (
    <section className="bg-muted/15 py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <FadeInView className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Built With Modern Technology
          </h2>
          <p className="mt-3 text-pretty text-muted-foreground sm:text-lg">
            A pragmatic stack for research iteration, observability, and
            deployment readiness.
          </p>
        </FadeInView>

        <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 lg:gap-4">
          {stack.map((item) => (
            <FadeInView key={item.name} className="h-full">
              <div className="flex h-full min-h-[5.5rem] flex-col items-center justify-center gap-1.5 rounded-xl border border-border/60 bg-card/80 px-3 py-4 text-center shadow-sm transition-colors hover:border-primary/20 hover:shadow-md">
                <Badge variant="secondary" className="px-3 py-1 text-sm font-semibold">
                  {item.name}
                </Badge>
                <span className="text-xs leading-snug text-muted-foreground">
                  {item.blurb}
                </span>
              </div>
            </FadeInView>
          ))}
        </div>
      </div>
    </section>
  );
}

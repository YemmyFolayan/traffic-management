import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen, Cpu, Layers, Target } from "lucide-react";

import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FadeInView } from "@/components/landing/fade-in-view";

export const metadata: Metadata = {
  title: "About · ITMS Research",
  description:
    "Methodology, architecture, and objectives for the Intelligent Traffic Management System (ITMS) research at FUTA.",
};

const objectives = [
  "Learn adaptive policies that reduce average delay and queue lengths.",
  "Improve corridor throughput and travel-time reliability versus fixed plans.",
  "Enable safe simulation-to-reality transfer with measurable KPIs.",
  "Support multi-intersection coordination under stochastic demand.",
] as const;

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <section className="relative overflow-hidden border-b border-border/50 bg-gradient-to-br from-primary/[0.06] via-background to-secondary/30 pt-28 pb-16">
          <div className="pointer-events-none absolute inset-0 -z-10 opacity-40">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `radial-gradient(circle at 1px 1px, hsl(var(--border)) 1px, transparent 0)`,
                backgroundSize: "24px 24px",
              }}
            />
          </div>
          <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
            <FadeInView>
              <p className="text-sm font-medium text-primary">FUTA · ITMS Research</p>
              <h1 className="mt-3 text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
                The Development of an Intelligent Traffic Management System using
                Deep Reinforcement Learning to Optimize Urban Traffic Flow
              </h1>
              <p className="mx-auto mt-5 max-w-2xl text-pretty text-muted-foreground sm:text-lg">
                This project investigates how deep reinforcement learning can
                replace rigid signal schedules with policies that adapt to
                congestion, incidents, and varying demand — evaluated through
                simulation and operational metrics.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Link
                  href="/#results"
                  className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
                >
                  View results
                </Link>
                <Link
                  href="/"
                  className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-6 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
                >
                  Back to home
                </Link>
              </div>
            </FadeInView>
          </div>
        </section>

        <section className="py-14 sm:py-16">
          <div className="mx-auto max-w-6xl space-y-12 px-4 sm:px-6 lg:px-8">
            <FadeInView>
              <div className="flex items-start gap-3">
                <span className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border/60 bg-primary/5 text-primary">
                  <BookOpen className="h-5 w-5" />
                </span>
                <div>
                  <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                    Research methodology
                  </h2>
                  <p className="mt-3 max-w-3xl text-pretty leading-relaxed text-muted-foreground">
                    We formulate traffic signal control as a Markov Decision
                    Process where the agent observes congestion-related state
                    features (e.g., queue lengths, waits, arrivals) and selects
                    discrete actions such as phase switches or extensions. A Deep
                    Q-Network (DQN) approximates action values, trained with
                    experience replay and target networks for stability. Policies
                    are trained in a high-fidelity simulation environment and
                    compared against fixed-time and rule-based baselines using
                    delay, throughput, and environmental proxies.
                  </p>
                </div>
              </div>
            </FadeInView>

            <FadeInView>
              <div className="flex items-start gap-3">
                <span className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border/60 bg-primary/5 text-primary">
                  <Layers className="h-5 w-5" />
                </span>
                <div>
                  <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                    System architecture
                  </h2>
                  <p className="mt-3 max-w-3xl text-pretty leading-relaxed text-muted-foreground">
                    The platform follows a modular architecture: a{" "}
                    <strong className="font-medium text-foreground">
                      simulation / control layer
                    </strong>{" "}
                    exposes state transitions and rewards; a{" "}
                    <strong className="font-medium text-foreground">
                      training service
                    </strong>{" "}
                    runs DRL experiments and stores checkpoints; an{" "}
                    <strong className="font-medium text-foreground">
                      application backend
                    </strong>{" "}
                    serves REST APIs and realtime channels; and a{" "}
                    <strong className="font-medium text-foreground">
                      web dashboard
                    </strong>{" "}
                    visualizes live metrics, intersection status, and evaluation
                    summaries. Persistent configuration and run metadata reside
                    in a relational database to support reproducibility.
                  </p>
                  <pre className="mt-6 overflow-x-auto rounded-xl border border-border/60 bg-muted/30 p-4 text-left text-xs leading-relaxed text-muted-foreground shadow-inner sm:text-sm">
{`┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│   Sensors /  │───▶│  State &     │───▶│  DRL Agent   │
│  Simulation  │    │  Reward      │    │  (DQN)       │
└──────────────┘    └──────────────┘    └──────┬───────┘
                                               │
                                               ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│  Dashboard   │◀───│  API +       │◀───│  Signal      │
│  (Next.js)   │    │  Realtime    │    │  Controller  │
└──────────────┘    └──────────────┘    └──────────────┘`}
                  </pre>
                </div>
              </div>
            </FadeInView>

            <FadeInView>
              <div className="flex items-start gap-3">
                <span className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border/60 bg-primary/5 text-primary">
                  <Target className="h-5 w-5" />
                </span>
                <div className="w-full">
                  <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                    Research objectives
                  </h2>
                  <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                    {objectives.map((obj) => (
                      <li
                        key={obj}
                        className="flex gap-2 rounded-lg border border-border/50 bg-card/60 px-4 py-3 text-sm leading-relaxed text-muted-foreground"
                      >
                        <span
                          className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary"
                          aria-hidden
                        />
                        {obj}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </FadeInView>

            <FadeInView>
              <div className="flex items-start gap-3">
                <span className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border/60 bg-primary/5 text-primary">
                  <Cpu className="h-5 w-5" />
                </span>
                <div className="w-full">
                  <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                    Researchers
                  </h2>
                  <p className="mt-3 max-w-3xl text-muted-foreground">
                    Team details will be published here (names, roles, and
                    contact). This section is a placeholder during the research
                    phase.
                  </p>
                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    {[1, 2].map((i) => (
                      <Card
                        key={i}
                        className="border-dashed border-border/80 bg-muted/10"
                      >
                        <CardHeader>
                          <CardTitle className="text-base">
                            Researcher {i}
                          </CardTitle>
                          <CardDescription>
                            Role, department, and email — coming soon.
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="text-sm text-muted-foreground">
                          Affiliation: Federal University of Technology, Akure
                          (FUTA)
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            </FadeInView>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

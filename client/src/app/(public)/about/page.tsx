import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen, Cpu, Layers, Mail, Target } from "lucide-react";

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
  "Develop an ITMS model using deep reinforcement learning to optimize urban traffic flow.",
  "Evaluate the system's performance in reducing congestion and waiting time, while improving road safety under dynamic traffic conditions.",
] as const;

const researchers = [
  {
    name: "M.I. Folayan",
    role: "Lead Researcher",
    email: "michaelfolayan@outlook.com",
    superscript: "1*",
  },
  {
    name: "S.A. Oluwadare",
    role: "Supervisor",
    email: "saoluwadare@futa.edu.ng",
    superscript: "2",
  },
  {
    name: "I.P. Adegun",
    role: "Co-Supervisor",
    email: "ipadegun@futa.edu.ng",
    superscript: "3",
  },
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
              <p className="text-sm font-medium text-primary">
                FUTA · Department of Computer Science
              </p>
              <h1 className="mt-3 text-balance text-2xl font-bold tracking-tight text-foreground sm:text-3xl lg:text-4xl">
                Towards the Development of a Framework for Intelligent Traffic
                Management Using Deep Reinforcement Learning and Edge Computing
              </h1>
              <p className="mx-auto mt-5 max-w-2xl text-pretty text-muted-foreground sm:text-lg">
                This study proposes an Intelligent Traffic Management System
                (ITMS) that integrates Deep Reinforcement Learning (DRL) with
                real-time IoT sensing. It employs a Deep Q-Network (DQN) to
                optimize signal timings based on real-time vehicle counts, queue
                lengths, and emergency vehicle detection. Simulation results in
                SUMO demonstrate a 37.7% reduction in average vehicle delay and
                an 80.8% reduction in emergency wait times compared to static
                systems.
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
                    Research Methodology
                  </h2>
                  <p className="mt-3 max-w-3xl text-pretty leading-relaxed text-muted-foreground">
                    This research adopts a design-oriented and experimental
                    methodology. The ITMS operates by continuously sensing
                    traffic conditions, modeling the environment as a Markov
                    Decision Process (MDP), learning optimal traffic signal
                    control policies using a Deep Q-Network (DQN), and
                    evaluating performance against conventional traffic control
                    methods. The DQN agent learns through experience replay and
                    target networks for stability, with a learning rate of 0.001
                    and discount factor of 0.95. Training was conducted in two
                    phases: base training using synthetic SUMO data, followed by
                    fine-tuning with real-world data from five critical junctions
                    in Akure, Nigeria.
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
                    System Architecture
                  </h2>
                  <p className="mt-3 max-w-3xl text-pretty leading-relaxed text-muted-foreground">
                    The ITMS architecture consists of four main layers: a{" "}
                    <strong className="font-medium text-foreground">
                      Data Acquisition Layer
                    </strong>{" "}
                    capturing raw data from IoT sensors and CCTV cameras; a{" "}
                    <strong className="font-medium text-foreground">
                      Pre-processing and State Representation Layer
                    </strong>{" "}
                    for filtering, normalization, and state vector construction
                    at edge nodes; an{" "}
                    <strong className="font-medium text-foreground">
                      Intelligent Control Layer
                    </strong>{" "}
                    implementing the DQN model with multi-agent coordination;
                    and an{" "}
                    <strong className="font-medium text-foreground">
                      Evaluation and Performance Analysis Layer
                    </strong>{" "}
                    providing monitoring, analytics, and visualization through
                    the cloud-based dashboard.
                  </p>
                  <pre className="mt-6 overflow-x-auto rounded-xl border border-border/60 bg-muted/30 p-4 text-left text-xs leading-relaxed text-muted-foreground shadow-inner sm:text-sm">
{`┌──────────────────┐    ┌──────────────────┐    ┌──────────────────┐
│  Data Acquisition│───▶│  Pre-processing  │───▶│  DRL Agent       │
│  (IoT Sensors)   │    │  (Edge Nodes)    │    │  (DQN)           │
└──────────────────┘    └──────────────────┘    └────────┬─────────┘
                                                         │
                                                         ▼
┌──────────────────┐    ┌──────────────────┐    ┌──────────────────┐
│  Dashboard       │◀───│  API + Realtime  │◀───│  Signal          │
│  (React/Maps)    │    │  (NestJS/WS)     │    │  Controller      │
└──────────────────┘    └──────────────────┘    └──────────────────┘`}
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
                    Research Objectives
                  </h2>
                  <p className="mt-3 max-w-3xl text-muted-foreground">
                    The aim of this research is to develop an Intelligent Traffic
                    Management System model using deep learning to address the
                    challenges of urban congestion and road safety.
                  </p>
                  <ul className="mt-6 grid gap-3 sm:grid-cols-1">
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
                    Department of Computer Science, School of Computing — Federal
                    University of Technology, Akure, Nigeria.
                  </p>
                  <div className="mt-6 grid gap-4 sm:grid-cols-3">
                    {researchers.map((r) => (
                      <Card
                        key={r.name}
                        className="border-border/80 bg-card/80"
                      >
                        <CardHeader>
                          <CardTitle className="text-base">
                            {r.name}
                            <sup className="ml-0.5 text-xs text-muted-foreground">
                              {r.superscript}
                            </sup>
                          </CardTitle>
                          <CardDescription className="font-medium text-primary/80">
                            {r.role}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-1 text-sm text-muted-foreground">
                          <a
                            href={`mailto:${r.email}`}
                            className="inline-flex items-center gap-1.5 text-primary transition-colors hover:text-primary/80"
                          >
                            <Mail className="h-3.5 w-3.5" />
                            {r.email}
                          </a>
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

"use client";

import {
  Activity,
  BarChart3,
  Brain,
  Cpu,
  Radar,
  ShieldAlert,
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
    title: "Deep Q-Network (DQN)",
    description:
      "Reinforcement learning agent that continuously learns optimal signal control policies by interacting with the traffic environment via experience replay and target networks.",
    icon: Brain,
  },
  {
    title: "IoT Sensor Network",
    description:
      "HC-SR04 ultrasonic sensors and Raspberry Pi Camera Modules deployed at intersections for real-time vehicle detection, queue estimation, and YOLOv8-based classification.",
    icon: Radar,
  },
  {
    title: "Edge Computing",
    description:
      "Raspberry Pi 4 edge nodes perform local DQN inference and state vector construction for low-latency signal control, with UPS backup for power resilience.",
    icon: Cpu,
  },
  {
    title: "Emergency Vehicle Priority",
    description:
      "Binary emergency flag in the state representation enables the DRL agent to dynamically grant immediate right-of-way, achieving 80.8% reduction in emergency wait times.",
    icon: ShieldAlert,
  },
  {
    title: "Real-time Dashboard",
    description:
      "Cloud-based monitoring interface built with React and Google Maps, using Socket.IO for bidirectional real-time updates on vehicle counts, queue lengths, and signal states.",
    icon: Activity,
  },
  {
    title: "SUMO Simulation",
    description:
      "Realistic traffic environments modeled using SUMO with OpenStreetMap data and TraCI interface, validated across 30 independent runs with stochastic traffic seeds.",
    icon: SlidersHorizontal,
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

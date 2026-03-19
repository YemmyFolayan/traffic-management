"use client";

import { FadeInView } from "@/components/landing/fade-in-view";

export function MethodologySection() {
  return (
    <section
      id="methodology"
      className="scroll-mt-24 bg-gradient-to-b from-background to-muted/25 py-16 sm:py-20"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <FadeInView className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Methodology
          </h2>
          <p className="mt-3 text-pretty text-muted-foreground sm:text-lg">
            Traffic signal control formulated as a Markov Decision Process,
            solved with a Deep Q-Network trained in SUMO simulation.
          </p>
        </FadeInView>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          <FadeInView>
            <div className="h-full rounded-2xl border border-border/60 bg-card/70 p-6 shadow-sm">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-primary">
                State Representation
              </h3>
              <div className="mt-4 rounded-lg bg-muted/40 p-4">
                <p className="font-mono text-sm text-foreground">
                  S<sub>t</sub> = [v<sub>1</sub>, ..., v<sub>n</sub>, q
                  <sub>1</sub>, ..., q<sub>n</sub>, w<sub>1</sub>, ..., w
                  <sub>m</sub>, e]
                </p>
              </div>
              <ul className="mt-4 space-y-2 text-sm leading-relaxed text-muted-foreground">
                <li>
                  <strong className="font-medium text-foreground">
                    v<sub>i</sub>
                  </strong>{" "}
                  — vehicle count on lane i
                </li>
                <li>
                  <strong className="font-medium text-foreground">
                    q<sub>i</sub>
                  </strong>{" "}
                  — average queue length (m) on lane i
                </li>
                <li>
                  <strong className="font-medium text-foreground">
                    w<sub>i</sub>
                  </strong>{" "}
                  — average waiting time on lane i
                </li>
                <li>
                  <strong className="font-medium text-foreground">e</strong> —
                  binary emergency vehicle flag
                </li>
              </ul>
            </div>
          </FadeInView>

          <FadeInView>
            <div className="h-full rounded-2xl border border-border/60 bg-card/70 p-6 shadow-sm">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-primary">
                Action Space
              </h3>
              <div className="mt-4 rounded-lg bg-muted/40 p-4">
                <p className="font-mono text-sm text-foreground">
                  A = &#123;a<sup>(1)</sup>, a<sup>(2)</sup>, a<sup>(3)</sup>
                  &#125;
                </p>
              </div>
              <ul className="mt-4 space-y-2 text-sm leading-relaxed text-muted-foreground">
                <li>
                  <strong className="font-medium text-foreground">
                    a<sup>(1)</sup>
                  </strong>{" "}
                  — Extend Phase 1
                </li>
                <li>
                  <strong className="font-medium text-foreground">
                    a<sup>(2)</sup>
                  </strong>{" "}
                  — Extend Phase 2
                </li>
                <li>
                  <strong className="font-medium text-foreground">
                    a<sup>(3)</sup>
                  </strong>{" "}
                  — Switch to Next Phase
                </li>
              </ul>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                Actions correspond to selecting or extending traffic light phases
                at a four-way intersection.
              </p>
            </div>
          </FadeInView>

          <FadeInView>
            <div className="h-full rounded-2xl border border-border/60 bg-card/70 p-6 shadow-sm">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-primary">
                Reward Function
              </h3>
              <div className="mt-4 rounded-lg bg-muted/40 p-4">
                <p className="font-mono text-sm text-foreground">
                  r<sub>t</sub> = &minus;&alpha;&Sigma;w<sub>i</sub> +
                  &beta;&Sigma;p<sub>i</sub> &minus; &gamma;d<sub>e</sub>
                </p>
              </div>
              <ul className="mt-4 space-y-2 text-sm leading-relaxed text-muted-foreground">
                <li>
                  <strong className="font-medium text-foreground">
                    &alpha;&Sigma;w<sub>i</sub>
                  </strong>{" "}
                  — penalizes lane waiting times
                </li>
                <li>
                  <strong className="font-medium text-foreground">
                    &beta;&Sigma;p<sub>i</sub>
                  </strong>{" "}
                  — rewards vehicle throughput
                </li>
                <li>
                  <strong className="font-medium text-foreground">
                    &gamma;d<sub>e</sub>
                  </strong>{" "}
                  — penalizes emergency vehicle delay
                </li>
              </ul>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                Balances efficiency, throughput, and safety in a multi-objective
                formulation.
              </p>
            </div>
          </FadeInView>
        </div>

        <FadeInView className="mt-10">
          <div className="rounded-xl border border-border/60 bg-card/70 p-6 shadow-sm backdrop-blur-sm sm:p-8">
            <h3 className="text-lg font-semibold tracking-tight">
              Deep Q-Network (DQN) Model
            </h3>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">
              The DQN approximates the optimal action-value function Q*(s, a) and
              updates its parameters by minimizing the temporal difference loss.
              Training uses experience replay and a target network (updated every
              C steps) for stability. Key hyperparameters: learning rate = 0.001,
              discount factor (&gamma;) = 0.95. The model was implemented in
              TensorFlow 2.10 and Keras, with base training on synthetic SUMO
              data followed by fine-tuning with real-world data from a prototype
              deployment across five critical junctions in Akure, Nigeria.
            </p>
          </div>
        </FadeInView>
      </div>
    </section>
  );
}

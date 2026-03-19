"use client";

import { Mail } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FadeInView } from "@/components/landing/fade-in-view";

const researchers = [
  {
    name: "M.I. Folayan",
    role: "Lead Researcher",
    department: "Department of Computer Science, School of Computing",
    institution: "Federal University of Technology, Akure, Nigeria",
    email: "michaelfolayan@outlook.com",
    superscript: "1*",
  },
  {
    name: "S.A. Oluwadare",
    role: "Supervisor",
    department: "Department of Computer Science, School of Computing",
    institution: "Federal University of Technology, Akure, Nigeria",
    email: "saoluwadare@futa.edu.ng",
    superscript: "2",
  },
  {
    name: "I.P. Adegun",
    role: "Co-Supervisor",
    department: "Department of Computer Science, School of Computing",
    institution: "Federal University of Technology, Akure, Nigeria",
    email: "ipadegun@futa.edu.ng",
    superscript: "3",
  },
] as const;

export function ResearchersSection() {
  return (
    <section
      id="researchers"
      className="scroll-mt-24 border-y border-border/50 bg-muted/20 py-16 sm:py-20"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <FadeInView className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Researchers
          </h2>
          <p className="mt-3 text-pretty text-muted-foreground sm:text-lg">
            Department of Computer Science, School of Computing — Federal
            University of Technology, Akure, Nigeria.
          </p>
        </FadeInView>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {researchers.map((r) => (
            <FadeInView key={r.name}>
              <Card className="group h-full border-border/60 bg-card/80 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/25 hover:shadow-md">
                <CardHeader>
                  <CardTitle className="text-lg">
                    {r.name}
                    <sup className="ml-0.5 text-xs text-muted-foreground">
                      {r.superscript}
                    </sup>
                  </CardTitle>
                  <CardDescription className="font-medium text-primary/80">
                    {r.role}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {r.department}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {r.institution}
                  </p>
                  <a
                    href={`mailto:${r.email}`}
                    className="inline-flex items-center gap-1.5 text-sm text-primary transition-colors hover:text-primary/80"
                  >
                    <Mail className="h-3.5 w-3.5" />
                    {r.email}
                  </a>
                </CardContent>
              </Card>
            </FadeInView>
          ))}
        </div>
      </div>
    </section>
  );
}

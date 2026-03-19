"use client";

import { useEffect, useMemo, useState } from "react";
import { MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { DemoDataNotice } from "@/components/dashboard/demo-data-notice";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

type Phase = "RED" | "YELLOW" | "GREEN";

interface NodeState {
  id: string;
  label: string;
  north: Phase;
  south: Phase;
  east: Phase;
  west: Phase;
}

const phaseClass: Record<Phase, string> = {
  RED: "bg-traffic-red shadow-[0_0_8px_rgba(239,68,68,0.6)]",
  YELLOW: "bg-traffic-yellow shadow-[0_0_8px_rgba(234,179,8,0.6)]",
  GREEN: "bg-traffic-green shadow-[0_0_8px_rgba(34,197,94,0.6)]",
};

function cyclePhase(p: Phase): Phase {
  if (p === "RED") return "GREEN";
  if (p === "GREEN") return "YELLOW";
  return "RED";
}

export default function TrafficMapPage() {
  const [selected, setSelected] = useState<number | null>(0);
  const [tick, setTick] = useState(0);

  const nodes = useMemo<NodeState[]>(() => {
    const out: NodeState[] = [];
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        const i = r * 4 + c;
        const base: Phase[] = ["RED", "YELLOW", "GREEN"];
        out.push({
          id: `IX-${r + 1}${c + 1}`,
          label: `Intersection ${r + 1}-${c + 1}`,
          north: base[i % 3],
          south: base[(i + 1) % 3],
          east: base[(i + 2) % 3],
          west: base[(i + 3) % 3],
        });
      }
    }
    return out;
  }, []);

  const [live, setLive] = useState<NodeState[]>(nodes);

  useEffect(() => {
    setLive(nodes);
  }, [nodes]);

  useEffect(() => {
    const id = window.setInterval(() => {
      setTick((t) => t + 1);
      setLive((prev) =>
        prev.map((n) => ({
          ...n,
          north: cyclePhase(n.north),
          south: cyclePhase(n.south),
          east: cyclePhase(n.east),
          west: cyclePhase(n.west),
        })),
      );
    }, 2200);
    return () => clearInterval(id);
  }, []);

  const active = selected != null ? live[selected] : null;

  return (
    <div className="space-y-6">
      <DemoDataNotice
        show
        message="Animated preview — connect the live engine for real signal telemetry."
      />
      <div>
        <h2 className="text-xl font-semibold tracking-tight md:text-2xl">
          Traffic map
        </h2>
        <p className="text-sm text-muted-foreground">
          Live grid view of signal phases across the network (demo animation).
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_320px]">
        <Card className="overflow-hidden border-border/80 shadow-sm transition-shadow duration-300 hover:shadow-md">
          <CardHeader className="relative border-b bg-muted/20 pb-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  Network topology
                </CardTitle>
                <CardDescription>
                  Select a junction to inspect signal heads. Tick{" "}
                  <span className="font-mono tabular-nums">{tick}</span>
                </CardDescription>
              </div>
              <Badge
                variant="secondary"
                className="shrink-0 animate-pulse font-normal"
              >
                Live Traffic Map
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-4 md:p-6">
            <div className="relative mx-auto max-w-3xl rounded-xl border border-border bg-gradient-to-b from-muted/40 to-muted/10 p-3 md:p-4">
              {/* Road grid background */}
              <div
                className="pointer-events-none absolute inset-3 md:inset-4 rounded-lg opacity-40"
                style={{
                  backgroundImage: `
                    linear-gradient(to right, hsl(var(--border)) 1px, transparent 1px),
                    linear-gradient(to bottom, hsl(var(--border)) 1px, transparent 1px)
                  `,
                  backgroundSize: "25% 25%",
                }}
              />
              <div className="relative grid grid-cols-4 gap-2 sm:gap-3 md:gap-4">
                {live.map((node, i) => {
                  const isSel = selected === i;
                  return (
                    <button
                      key={node.id}
                      type="button"
                      onClick={() => setSelected(i)}
                      className={cn(
                        "group relative flex aspect-square flex-col items-center justify-center rounded-lg border-2 bg-card/95 p-1.5 text-left shadow-sm transition-all duration-200",
                        "hover:border-primary/50 hover:shadow-md",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                        isSel
                          ? "border-primary ring-2 ring-primary/20"
                          : "border-border",
                      )}
                    >
                      <span className="mb-1 w-full truncate text-center text-[10px] font-semibold uppercase tracking-wide text-muted-foreground sm:text-xs">
                        {node.id}
                      </span>
                      <div className="relative grid h-12 w-12 place-items-center sm:h-14 sm:w-14">
                        <div
                          className={cn(
                            "absolute -top-0.5 left-1/2 h-2.5 w-2.5 -translate-x-1/2 rounded-full transition-colors duration-500",
                            phaseClass[node.north],
                          )}
                        />
                        <div
                          className={cn(
                            "absolute -bottom-0.5 left-1/2 h-2.5 w-2.5 -translate-x-1/2 rounded-full transition-colors duration-500",
                            phaseClass[node.south],
                          )}
                        />
                        <div
                          className={cn(
                            "absolute -left-0.5 top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full transition-colors duration-500",
                            phaseClass[node.west],
                          )}
                        />
                        <div
                          className={cn(
                            "absolute -right-0.5 top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full transition-colors duration-500",
                            phaseClass[node.east],
                          )}
                        />
                        <div className="h-6 w-6 rounded-md border border-dashed border-muted-foreground/30 bg-muted/30 sm:h-7 sm:w-7" />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="h-fit border-border/80 shadow-sm xl:sticky xl:top-24">
          <CardHeader>
            <CardTitle className="text-base">Intersection detail</CardTitle>
            <CardDescription>
              Signal heads for the selected junction.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {active ? (
              <>
                <div>
                  <p className="text-sm font-medium">{active.label}</p>
                  <p className="font-mono text-xs text-muted-foreground">
                    {active.id}
                  </p>
                </div>
                <Separator />
                <div className="grid grid-cols-2 gap-3 text-sm">
                  {(
                    [
                      ["North", active.north],
                      ["South", active.south],
                      ["East", active.east],
                      ["West", active.west],
                    ] as const
                  ).map(([dir, ph]) => (
                    <div
                      key={dir}
                      className="flex items-center justify-between rounded-md border bg-muted/30 px-3 py-2"
                    >
                      <span className="text-muted-foreground">{dir}</span>
                      <span
                        className={cn(
                          "font-medium",
                          ph === "GREEN" && "text-traffic-green",
                          ph === "YELLOW" && "text-yellow-600",
                          ph === "RED" && "text-traffic-red",
                        )}
                      >
                        {ph}
                      </span>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">
                  Phases rotate on a demo timer. Connect to the live engine to
                  bind real telemetry.
                </p>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">
                Tap an intersection on the map.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

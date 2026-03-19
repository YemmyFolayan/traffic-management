"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { DEMO_SIMULATION_RUNS } from "@/lib/demo-data";
import { DemoDataNotice } from "@/components/dashboard/demo-data-notice";
import type { SimulationRun } from "@/types";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

export default function SimulationHistoryPage() {
  const [runs, setRuns] = useState<SimulationRun[]>([]);
  const [loading, setLoading] = useState(true);
  const [demoData, setDemoData] = useState(false);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const res = await api.getSimulationHistory();
        if (cancelled) return;
        if (res.status && res.entity) {
          setRuns(res.entity);
          setDemoData(false);
        } else {
          setRuns(DEMO_SIMULATION_RUNS);
          setDemoData(true);
        }
      } catch {
        if (!cancelled) {
          setRuns(DEMO_SIMULATION_RUNS);
          setDemoData(true);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="space-y-6">
      <DemoDataNotice show={demoData} />
      <div>
        <h2 className="text-xl font-semibold tracking-tight md:text-2xl">
          Simulation History
        </h2>
        <p className="text-sm text-muted-foreground">
          Past simulation runs and their results
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Run History</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : runs.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No simulation runs yet. Go to the Simulation page to run one.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Status</TableHead>
                  <TableHead>Mode</TableHead>
                  <TableHead>Vehicles</TableHead>
                  <TableHead>Avg Wait</TableHead>
                  <TableHead>Throughput</TableHead>
                  <TableHead>Started</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {runs.map((run) => (
                  <TableRow key={run.id}>
                    <TableCell>
                      <Badge
                        variant={
                          run.status === "COMPLETED"
                            ? "success"
                            : run.status === "RUNNING"
                              ? "default"
                              : "destructive"
                        }
                      >
                        {run.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {run.config?.useRL ? "DRL" : "Fixed-Time"}
                    </TableCell>
                    <TableCell>{run.config?.vehicleCount || "—"}</TableCell>
                    <TableCell>
                      {run.results?.avgWaitTime?.toFixed(2) || "—"}s
                    </TableCell>
                    <TableCell>{run.results?.throughput || "—"}</TableCell>
                    <TableCell>
                      {new Date(run.startedAt).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

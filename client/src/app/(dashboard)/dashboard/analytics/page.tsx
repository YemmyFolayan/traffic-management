"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Download } from "lucide-react";
import { api } from "@/lib/api";
import {
  DEMO_OVERVIEW,
  DEMO_COMPARISON,
  generateDemoTrafficMetrics,
} from "@/lib/demo-data";
import { DemoDataNotice } from "@/components/dashboard/demo-data-notice";
import type { AnalyticsOverview, ComparisonData, TrafficMetric } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "@/hooks/use-toast";

export default function AnalyticsPage() {
  const [overview, setOverview] = useState<AnalyticsOverview | null>(null);
  const [comparison, setComparison] = useState<ComparisonData[]>([]);
  const [metrics, setMetrics] = useState<TrafficMetric[]>([]);
  const [loadingOverview, setLoadingOverview] = useState(true);
  const [loadingComp, setLoadingComp] = useState(true);
  const [loadingMetrics, setLoadingMetrics] = useState(false);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [demoSources, setDemoSources] = useState({
    overview: false,
    comparison: false,
    metrics: false,
  });
  const showDemoNotice =
    demoSources.overview || demoSources.comparison || demoSources.metrics;

  const loadOverview = useCallback(async () => {
    setLoadingOverview(true);
    try {
      const res = await api.getAnalyticsOverview();
      if (res.status && res.entity) {
        setOverview(res.entity);
        setDemoSources((s) => ({ ...s, overview: false }));
      } else {
        setOverview(DEMO_OVERVIEW);
        setDemoSources((s) => ({ ...s, overview: true }));
      }
    } catch {
      setOverview(DEMO_OVERVIEW);
      setDemoSources((s) => ({ ...s, overview: true }));
    }
    setLoadingOverview(false);
  }, []);

  const loadComparison = useCallback(async () => {
    setLoadingComp(true);
    try {
      const res = await api.getComparisonData();
      if (res.status && res.entity) {
        setComparison(res.entity);
        setDemoSources((s) => ({ ...s, comparison: false }));
      } else {
        setComparison(DEMO_COMPARISON);
        setDemoSources((s) => ({ ...s, comparison: true }));
      }
    } catch {
      setComparison(DEMO_COMPARISON);
      setDemoSources((s) => ({ ...s, comparison: true }));
    }
    setLoadingComp(false);
  }, []);

  const loadMetrics = useCallback(async () => {
    setLoadingMetrics(true);
    try {
      const res = await api.getTrafficMetrics(
        from && to
          ? { from: new Date(from).toISOString(), to: new Date(to).toISOString() }
          : undefined,
      );
      if (res.status && res.entity) {
        setMetrics(res.entity);
        setDemoSources((s) => ({ ...s, metrics: false }));
      } else {
        setMetrics(generateDemoTrafficMetrics());
        setDemoSources((s) => ({ ...s, metrics: true }));
      }
    } catch {
      setMetrics(generateDemoTrafficMetrics());
      setDemoSources((s) => ({ ...s, metrics: true }));
    }
    setLoadingMetrics(false);
  }, [from, to]);

  useEffect(() => {
    void loadOverview();
    void loadComparison();
  }, [loadOverview, loadComparison]);

  useEffect(() => {
    void loadMetrics();
    // Initial load only; use Apply to refetch with a date range
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const barData = useMemo(
    () =>
      comparison.map((c) => ({
        metric: c.metric,
        fixed: c.fixedTime,
        drl: c.drlOptimized,
      })),
    [comparison],
  );

  const flowTrend = useMemo(() => {
    if (!metrics.length) {
      return [
        { t: "08:00", flow: 120 },
        { t: "10:00", flow: 180 },
        { t: "12:00", flow: 210 },
        { t: "14:00", flow: 165 },
        { t: "16:00", flow: 240 },
      ];
    }
    return metrics.slice(0, 24).map((m, i) => ({
      t: new Date(m.timestamp).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      flow: m.throughput,
    }));
  }, [metrics]);

  const exportCsv = () => {
    if (!metrics.length) {
      toast({ title: "Nothing to export", variant: "destructive" });
      return;
    }
    const header = [
      "id",
      "intersectionId",
      "timestamp",
      "avgWaitTime",
      "throughput",
      "queueLength",
      "congestionIndex",
    ];
    const lines = [
      header.join(","),
      ...metrics.map((m) =>
        [
          m.id,
          m.intersectionId,
          m.timestamp,
          m.avgWaitTime,
          m.throughput,
          m.queueLength,
          m.congestionIndex,
        ].join(","),
      ),
    ];
    const blob = new Blob([lines.join("\n")], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `traffic-metrics-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: "CSV exported" });
  };

  return (
    <div className="space-y-6">
      <DemoDataNotice show={showDemoNotice} />
      <div>
        <h2 className="text-xl font-semibold tracking-tight md:text-2xl">
          Analytics
        </h2>
        <p className="text-sm text-muted-foreground">
          Compare control strategies and inspect historical traffic metrics.
        </p>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full max-w-lg grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="comparison">Comparison</TabsTrigger>
          <TabsTrigger value="metrics">Metrics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6 animate-fade-in">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {loadingOverview ? (
              Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-28 rounded-lg" />
              ))
            ) : (
              <>
                <StatCard
                  label="Total intersections"
                  value={overview?.totalIntersections ?? "—"}
                />
                <StatCard
                  label="Active simulations"
                  value={overview?.activeSimulations ?? "—"}
                />
                <StatCard
                  label="Avg wait (s)"
                  value={
                    overview != null
                      ? overview.avgWaitTime.toFixed(2)
                      : "—"
                  }
                />
                <StatCard
                  label="DRL improvement"
                  value={
                    overview
                      ? `+${overview.improvementPercent.toFixed(1)}%`
                      : "—"
                  }
                  highlight
                />
              </>
            )}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Traffic flow over time</CardTitle>
              <CardDescription>
                Throughput trend — uses API metrics when available.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loadingOverview ? (
                <Skeleton className="h-[300px] w-full rounded-lg" />
              ) : (
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={flowTrend}>
                      <defs>
                        <linearGradient id="aFlow" x1="0" y1="0" x2="0" y2="1">
                          <stop
                            offset="5%"
                            stopColor="hsl(var(--primary))"
                            stopOpacity={0.35}
                          />
                          <stop
                            offset="95%"
                            stopColor="hsl(var(--primary))"
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="t" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} />
                      <Tooltip />
                      <Area
                        type="monotone"
                        dataKey="flow"
                        name="Throughput"
                        stroke="hsl(var(--primary))"
                        fill="url(#aFlow)"
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="comparison" className="space-y-6 animate-fade-in">
          <Card>
            <CardHeader>
              <CardTitle>Fixed-time vs DRL-optimized</CardTitle>
              <CardDescription>
                Side-by-side metrics with improvement deltas.
              </CardDescription>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              {loadingComp ? (
                <Skeleton className="h-48 w-full" />
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Metric</TableHead>
                      <TableHead className="text-right">Fixed-time</TableHead>
                      <TableHead className="text-right">DRL</TableHead>
                      <TableHead className="text-right">Improvement</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {comparison.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={4}
                          className="text-center text-muted-foreground"
                        >
                          No comparison data.
                        </TableCell>
                      </TableRow>
                    ) : (
                      comparison.map((row) => (
                        <TableRow key={row.metric}>
                          <TableCell className="font-medium">{row.metric}</TableCell>
                          <TableCell className="text-right tabular-nums">
                            {row.fixedTime.toFixed(2)}
                          </TableCell>
                          <TableCell className="text-right tabular-nums">
                            {row.drlOptimized.toFixed(2)}
                          </TableCell>
                          <TableCell className="text-right">
                            <span className="font-medium text-success">
                              +{row.improvement.toFixed(1)}%
                            </span>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Approach comparison</CardTitle>
              <CardDescription>Lower is better for delay-style metrics.</CardDescription>
            </CardHeader>
            <CardContent>
              {loadingComp ? (
                <Skeleton className="h-[320px] w-full rounded-lg" />
              ) : (
                <div className="h-[320px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={barData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="metric" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} />
                      <Tooltip />
                      <Legend />
                      <Bar
                        dataKey="fixed"
                        name="Fixed-time"
                        fill="hsl(var(--muted-foreground))"
                        radius={[4, 4, 0, 0]}
                      />
                      <Bar
                        dataKey="drl"
                        name="DRL-optimized"
                        fill="hsl(var(--primary))"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="metrics" className="space-y-6 animate-fade-in">
          <Card>
            <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <CardTitle>Historical traffic metrics</CardTitle>
                <CardDescription>
                  Filter by date range (optional) and export raw rows.
                </CardDescription>
              </div>
              <div className="flex flex-wrap gap-3">
                <div className="grid gap-1.5">
                  <Label htmlFor="from">From</Label>
                  <Input
                    id="from"
                    type="date"
                    value={from}
                    onChange={(e) => setFrom(e.target.value)}
                    className="w-[160px]"
                  />
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="to">To</Label>
                  <Input
                    id="to"
                    type="date"
                    value={to}
                    onChange={(e) => setTo(e.target.value)}
                    className="w-[160px]"
                  />
                </div>
                <Button
                  variant="secondary"
                  className="gap-2"
                  onClick={() => void loadMetrics()}
                >
                  Apply
                </Button>
                <Button variant="outline" className="gap-2" onClick={exportCsv}>
                  <Download className="h-4 w-4" />
                  Export CSV
                </Button>
              </div>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              {loadingMetrics ? (
                <div className="space-y-2">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <Skeleton key={i} className="h-10 w-full" />
                  ))}
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Time</TableHead>
                      <TableHead>Intersection</TableHead>
                      <TableHead className="text-right">Wait (s)</TableHead>
                      <TableHead className="text-right">Throughput</TableHead>
                      <TableHead className="text-right">Queue</TableHead>
                      <TableHead className="text-right">Congestion</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {metrics.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={6}
                          className="text-center text-muted-foreground"
                        >
                          No metrics for this range.
                        </TableCell>
                      </TableRow>
                    ) : (
                      metrics.map((m) => (
                        <TableRow key={m.id}>
                          <TableCell className="whitespace-nowrap text-muted-foreground">
                            {new Date(m.timestamp).toLocaleString()}
                          </TableCell>
                          <TableCell className="font-mono text-xs">
                            {m.intersectionId}
                          </TableCell>
                          <TableCell className="text-right tabular-nums">
                            {m.avgWaitTime.toFixed(2)}
                          </TableCell>
                          <TableCell className="text-right tabular-nums">
                            {m.throughput.toFixed(1)}
                          </TableCell>
                          <TableCell className="text-right tabular-nums">
                            {m.queueLength.toFixed(0)}
                          </TableCell>
                          <TableCell className="text-right tabular-nums">
                            {m.congestionIndex.toFixed(2)}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function StatCard({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string | number;
  highlight?: boolean;
}) {
  return (
    <Card
      className={`transition-shadow hover:shadow-md ${highlight ? "border-success/30 bg-success/5" : ""}`}
    >
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {label}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p
          className={`text-2xl font-bold tabular-nums ${highlight ? "text-success" : ""}`}
        >
          {value}
        </p>
      </CardContent>
    </Card>
  );
}

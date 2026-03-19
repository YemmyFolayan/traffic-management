"use client";

import { useEffect, useMemo, useState, type ComponentType } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Activity,
  Clock,
  GitBranch,
  Play,
  TrendingUp,
} from "lucide-react";
import { api } from "@/lib/api";
import { DEMO_OVERVIEW } from "@/lib/demo-data";
import { DemoDataNotice } from "@/components/dashboard/demo-data-notice";
import type { AnalyticsOverview } from "@/types";
import { useAuthStore } from "@/store/auth-store";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

const hourlySample = [
  { hour: "06:00", flow: 120 },
  { hour: "07:00", flow: 210 },
  { hour: "08:00", flow: 340 },
  { hour: "09:00", flow: 280 },
  { hour: "10:00", flow: 190 },
  { hour: "11:00", flow: 165 },
  { hour: "12:00", flow: 220 },
  { hour: "13:00", flow: 200 },
  { hour: "14:00", flow: 175 },
  { hour: "15:00", flow: 195 },
  { hour: "16:00", flow: 260 },
  { hour: "17:00", flow: 310 },
];

export default function DashboardOverviewPage() {
  const user = useAuthStore((s) => s.user);
  const [overview, setOverview] = useState<AnalyticsOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [demoData, setDemoData] = useState(false);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      setLoading(true);
      try {
        const res = await api.getAnalyticsOverview();
        if (!cancelled && res.status && res.entity) {
          setOverview(res.entity);
          setDemoData(false);
        } else if (!cancelled) {
          setOverview(DEMO_OVERVIEW);
          setDemoData(true);
        }
      } catch {
        if (!cancelled) {
          setOverview(DEMO_OVERVIEW);
          setDemoData(true);
        }
      }
      if (!cancelled) setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const metrics = useMemo(() => {
    if (!overview) {
      return {
        totalIntersections: 0,
        activeSimulations: 0,
        avgWaitTime: 0,
        improvementPercent: 0,
      };
    }
    return {
      totalIntersections: overview.totalIntersections,
      activeSimulations: overview.activeSimulations,
      avgWaitTime: overview.avgWaitTime,
      improvementPercent: overview.improvementPercent,
    };
  }, [overview]);

  return (
    <div className="space-y-6 md:space-y-8">
      <DemoDataNotice show={demoData} />
      <div className="animate-fade-in">
        <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
          Welcome back{user?.name ? `, ${user.name.split(" ")[0]}` : ""}
        </h2>
        <p className="mt-1 text-muted-foreground">
          Here&apos;s a snapshot of network performance and learning impact.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {loading ? (
          <>
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <Skeleton className="h-4 w-24" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-16" />
                  <Skeleton className="mt-2 h-3 w-32" />
                </CardContent>
              </Card>
            ))}
          </>
        ) : (
          <>
            <MetricCard
              title="Total Intersections"
              value={metrics.totalIntersections}
              hint="Registered in the network"
              icon={GitBranch}
            />
            <MetricCard
              title="Active Simulations"
              value={metrics.activeSimulations}
              hint="Currently running"
              icon={Play}
            />
            <MetricCard
              title="Avg Wait Time"
              value={`${metrics.avgWaitTime.toFixed(1)}s`}
              hint="Network-wide estimate"
              icon={Clock}
            />
            <MetricCard
              title="DRL Improvement"
              value={`+${metrics.improvementPercent.toFixed(1)}%`}
              hint="Vs fixed-time baseline"
              icon={TrendingUp}
              valueClassName="text-success"
            />
          </>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Traffic flow</CardTitle>
            <CardDescription>
              Hourly volume (sample trend) — correlate with peak periods.
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-0">
            {loading ? (
              <Skeleton className="mx-6 h-[280px] w-[calc(100%-3rem)] rounded-lg" />
            ) : (
              <div className="h-[280px] w-full transition-opacity duration-300">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={hourlySample}>
                    <defs>
                      <linearGradient id="flowFill" x1="0" y1="0" x2="0" y2="1">
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
                    <XAxis
                      dataKey="hour"
                      tick={{ fontSize: 11 }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      tick={{ fontSize: 11 }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip
                      contentStyle={{
                        borderRadius: "var(--radius)",
                        border: "1px solid hsl(var(--border))",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="flow"
                      name="Vehicles / hr"
                      stroke="hsl(var(--primary))"
                      fill="url(#flowFill)"
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Quick status
            </CardTitle>
            <CardDescription>
              Operational signals from your latest analytics pull.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {loading ? (
              <div className="space-y-3">
                <Skeleton className="h-16 w-full rounded-lg" />
                <Skeleton className="h-16 w-full rounded-lg" />
              </div>
            ) : (
              <>
                <div className="rounded-lg border border-border bg-muted/40 p-4 transition-colors hover:bg-muted/60">
                  <p className="text-xs font-medium text-muted-foreground">
                    Congestion index
                  </p>
                  <p className="mt-1 text-2xl font-semibold tabular-nums">
                    {overview?.congestionIndex.toFixed(2) ?? "—"}
                  </p>
                </div>
                <div className="rounded-lg border border-border bg-muted/40 p-4 transition-colors hover:bg-muted/60">
                  <p className="text-xs font-medium text-muted-foreground">
                    Avg throughput
                  </p>
                  <p className="mt-1 text-2xl font-semibold tabular-nums">
                    {overview?.avgThroughput.toFixed(0) ?? "—"}{" "}
                    <span className="text-sm font-normal text-muted-foreground">
                      veh/hr
                    </span>
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 pt-2">
                  <Badge variant="outline" className="font-normal">
                    Analytics synced
                  </Badge>
                  <Badge variant="secondary" className="font-normal">
                    Live RL ready
                  </Badge>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function MetricCard({
  title,
  value,
  hint,
  icon: Icon,
  valueClassName,
}: {
  title: string;
  value: string | number;
  hint: string;
  icon: ComponentType<{ className?: string }>;
  valueClassName?: string;
}) {
  return (
    <Card className="overflow-hidden transition-shadow duration-300 hover:shadow-md">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 text-primary" />
      </CardHeader>
      <CardContent>
        <p
          className={`text-3xl font-bold tracking-tight tabular-nums ${valueClassName ?? ""}`}
        >
          {value}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
      </CardContent>
    </Card>
  );
}

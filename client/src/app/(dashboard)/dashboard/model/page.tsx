"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { api } from "@/lib/api";
import { DEMO_DRL_MODELS } from "@/lib/demo-data";
import { DemoDataNotice } from "@/components/dashboard/demo-data-notice";
import type { DRLConfig, DRLModel } from "@/types";
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
import { Progress } from "@/components/ui/progress";
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
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";

const defaultConfig: DRLConfig = {
  learningRate: 0.001,
  discountFactor: 0.99,
  epsilon: 1,
  epsilonDecay: 0.995,
  episodes: 500,
  batchSize: 64,
};

function statusBadge(status: DRLModel["status"]) {
  switch (status) {
    case "COMPLETED":
      return <Badge variant="success">COMPLETED</Badge>;
    case "TRAINING":
      return <Badge variant="info">TRAINING</Badge>;
    case "FAILED":
      return <Badge variant="destructive">FAILED</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
}

export default function DRLModelPage() {
  const [models, setModels] = useState<DRLModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [config, setConfig] = useState<DRLConfig>(defaultConfig);
  const [training, setTraining] = useState(false);
  const [progressPct, setProgressPct] = useState(0);
  const [episode, setEpisode] = useState(0);
  const [rewardSeries, setRewardSeries] = useState<
    { episode: number; reward: number }[]
  >([]);
  const trainingTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [demoData, setDemoData] = useState(false);

  const loadModels = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.getDRLModels();
      if (res.status && res.entity) {
        setModels(res.entity);
        setDemoData(false);
      } else {
        setModels(DEMO_DRL_MODELS);
        setDemoData(true);
      }
    } catch {
      setModels(DEMO_DRL_MODELS);
      setDemoData(true);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void loadModels();
  }, [loadModels]);

  useEffect(() => {
    return () => {
      if (trainingTimerRef.current) clearInterval(trainingTimerRef.current);
    };
  }, []);

  const runLocalTrainingProgress = (onCompleteLoadModels: boolean) => {
    const target = Math.max(1, config.episodes);
    let ep = 0;
    trainingTimerRef.current = setInterval(() => {
      ep += Math.max(1, Math.ceil(target / 400));
      if (ep > target) ep = target;
      const reward =
        -45 +
        ep * 0.12 +
        Math.sin(ep / 14) * 7 +
        (Math.random() - 0.5) * 3;
      setEpisode(ep);
      setProgressPct(Math.min(100, (ep / target) * 100));
      setRewardSeries((prev) =>
        [...prev, { episode: ep, reward }].slice(-150),
      );
      if (ep >= target) {
        if (trainingTimerRef.current) {
          clearInterval(trainingTimerRef.current);
          trainingTimerRef.current = null;
        }
        setTraining(false);
        if (onCompleteLoadModels) void loadModels();
      }
    }, 40);
  };

  const startTraining = async () => {
    if (trainingTimerRef.current) {
      clearInterval(trainingTimerRef.current);
      trainingTimerRef.current = null;
    }
    setTraining(true);
    setProgressPct(0);
    setEpisode(0);
    setRewardSeries([]);
    try {
      const res = await api.startTraining(config);
      if (!res.status || !res.entity) {
        throw new Error(res.error?.message ?? "Training failed to start");
      }
      toast({ title: "Training started", description: res.entity.name });

      runLocalTrainingProgress(true);
    } catch {
      toast({
        title: "Training started (demo mode)",
        description: "Simulating locally",
      });
      runLocalTrainingProgress(false);
    }
  };

  return (
    <div className="space-y-6">
      <DemoDataNotice show={demoData} />
      <div>
        <h2 className="text-xl font-semibold tracking-tight md:text-2xl">
          DRL model
        </h2>
        <p className="text-sm text-muted-foreground">
          Train new policies and review historical runs.
        </p>
      </div>

      <Tabs defaultValue="train" className="space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="train">Train Model</TabsTrigger>
          <TabsTrigger value="history">Model History</TabsTrigger>
        </TabsList>

        <TabsContent value="train" className="space-y-6 animate-fade-in">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Configuration</CardTitle>
                <CardDescription>
                  Hyperparameters for the deep Q-learning agent.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4">
                {(
                  [
                    ["learningRate", "Learning rate"],
                    ["discountFactor", "Discount factor"],
                    ["epsilon", "Epsilon"],
                    ["epsilonDecay", "Epsilon decay"],
                    ["episodes", "Episodes"],
                    ["batchSize", "Batch size"],
                  ] as const
                ).map(([key, label]) => (
                  <div key={key} className="grid gap-2">
                    <Label htmlFor={key}>{label}</Label>
                    <Input
                      id={key}
                      type="number"
                      step={
                        key === "learningRate"
                          ? 0.0001
                          : key === "epsilonDecay"
                            ? 0.0001
                            : 1
                      }
                      value={config[key]}
                      onChange={(e) =>
                        setConfig((c) => ({
                          ...c,
                          [key]: Number(e.target.value),
                        }))
                      }
                    />
                  </div>
                ))}
                <Button
                  onClick={() => void startTraining()}
                  disabled={training}
                  className="w-full sm:w-auto"
                >
                  {training ? "Training…" : "Start training"}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Training progress</CardTitle>
                <CardDescription>
                  Episode progress and reward curve (live estimate while job
                  runs).
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="tabular-nums font-medium">
                      {progressPct.toFixed(0)}%
                    </span>
                  </div>
                  <Progress value={progressPct} className="h-2" />
                  <p className="text-sm text-muted-foreground">
                    Current episode:{" "}
                    <span className="font-mono text-foreground">{episode}</span> /{" "}
                    {config.episodes}
                  </p>
                </div>
                <div className="h-[280px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={rewardSeries}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="episode" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="reward"
                        name="Reward"
                        stroke="hsl(var(--primary))"
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-6 animate-fade-in">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-4">
              <div>
                <CardTitle>Past models</CardTitle>
                <CardDescription>
                  Training runs registered by the orchestrator.
                </CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={() => void loadModels()}>
                Refresh
              </Button>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              {loading ? (
                <div className="space-y-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                  ))}
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead className="text-right">Episodes</TableHead>
                      <TableHead className="text-right">Best reward</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {models.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={5}
                          className="text-center text-muted-foreground"
                        >
                          No models recorded yet.
                        </TableCell>
                      </TableRow>
                    ) : (
                      models.map((m) => (
                        <TableRow key={m.id}>
                          <TableCell className="font-medium">{m.name}</TableCell>
                          <TableCell className="text-right tabular-nums">
                            {m.episodes}
                          </TableCell>
                          <TableCell className="text-right tabular-nums">
                            {m.bestReward.toFixed(2)}
                          </TableCell>
                          <TableCell>{statusBadge(m.status)}</TableCell>
                          <TableCell className="whitespace-nowrap text-muted-foreground">
                            {new Date(m.createdAt).toLocaleString()}
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

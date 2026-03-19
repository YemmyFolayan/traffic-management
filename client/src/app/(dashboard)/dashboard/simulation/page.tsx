"use client";

import { useEffect, useRef, useState, type ComponentType } from "react";
import { Activity, Gauge, Layers, Timer } from "lucide-react";
import { generateDemoSimulationState } from "@/lib/demo-data";
import { DemoDataNotice } from "@/components/dashboard/demo-data-notice";
import type { SimulationState } from "@/types";
import { useSimulationStore } from "@/store/simulation-store";
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
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { TrafficCanvas } from "@/components/simulation/traffic-canvas";

export default function SimulationPage() {
  const config = useSimulationStore((s) => s.config);
  const updateConfig = useSimulationStore((s) => s.updateConfig);
  const connect = useSimulationStore((s) => s.connect);
  const disconnect = useSimulationStore((s) => s.disconnect);
  const startSimulation = useSimulationStore((s) => s.startSimulation);
  const stopSimulation = useSimulationStore((s) => s.stopSimulation);
  const resetSimulation = useSimulationStore((s) => s.resetSimulation);
  const simulationState = useSimulationStore((s) => s.simulationState);
  const isConnected = useSimulationStore((s) => s.isConnected);

  const [localDemoState, setLocalDemoState] = useState<SimulationState | null>(
    null,
  );
  const [offlineDemo, setOfflineDemo] = useState(false);
  const localDemoTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    connect();
    return () => disconnect();
  }, [connect, disconnect]);

  useEffect(() => {
    if (isConnected) {
      setOfflineDemo(false);
      return;
    }
    const t = window.setTimeout(() => setOfflineDemo(true), 2500);
    return () => clearTimeout(t);
  }, [isConnected]);

  useEffect(() => {
    if (isConnected) {
      if (localDemoTimerRef.current) {
        clearInterval(localDemoTimerRef.current);
        localDemoTimerRef.current = null;
      }
      setLocalDemoState(null);
    }
  }, [isConnected]);

  useEffect(() => {
    return () => {
      if (localDemoTimerRef.current) {
        clearInterval(localDemoTimerRef.current);
        localDemoTimerRef.current = null;
      }
    };
  }, []);

  const displayState = simulationState ?? localDemoState;
  const metrics = displayState?.metrics;
  const running = displayState?.running ?? false;
  const showSimDemoNotice = Boolean(localDemoState && !simulationState);

  const handleStart = () => {
    startSimulation(config);
    if (!isConnected) {
      if (localDemoTimerRef.current) {
        clearInterval(localDemoTimerRef.current);
        localDemoTimerRef.current = null;
      }
      let tick = 0;
      setLocalDemoState(generateDemoSimulationState(0, config));
      localDemoTimerRef.current = setInterval(() => {
        tick += 1;
        setLocalDemoState(generateDemoSimulationState(tick, config));
      }, 400);
    }
  };

  const handleStop = () => {
    stopSimulation();
    if (localDemoTimerRef.current) {
      clearInterval(localDemoTimerRef.current);
      localDemoTimerRef.current = null;
    }
    setLocalDemoState((prev) =>
      prev ? { ...prev, running: false } : null,
    );
  };

  const handleReset = () => {
    resetSimulation();
    if (localDemoTimerRef.current) {
      clearInterval(localDemoTimerRef.current);
      localDemoTimerRef.current = null;
    }
    setLocalDemoState(null);
  };

  return (
    <div className="space-y-6">
      <DemoDataNotice
        show={showSimDemoNotice || (offlineDemo && !isConnected)}
        message={
          showSimDemoNotice
            ? "Local simulation preview — WebSocket server unavailable."
            : "Backend not detected — Start runs a local preview when offline."
        }
      />
      <div>
        <h2 className="text-xl font-semibold tracking-tight md:text-2xl">
          Traffic simulation
        </h2>
        <p className="text-sm text-muted-foreground">
          Tune demand and control strategy, then observe live metrics from the
          engine.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Badge variant={isConnected ? "success" : "secondary"}>
          {isConnected ? "Socket connected" : "Connecting…"}
        </Badge>
        {offlineDemo && !isConnected && (
          <Badge variant="outline" className="font-normal text-amber-800 dark:text-amber-400">
            Offline demo
          </Badge>
        )}
        <Badge variant={running ? "default" : "outline"}>
          {running ? "Running" : "Idle"}
        </Badge>
      </div>

      <div className="grid gap-6 lg:grid-cols-12 lg:items-start">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Controls</CardTitle>
            <CardDescription>
              Adjust scenario parameters before starting the run.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <div className="flex flex-wrap items-end justify-between gap-3">
                <Label htmlFor="vehicles">Vehicle count</Label>
                <Input
                  id="vehicles-num"
                  type="number"
                  min={10}
                  max={200}
                  className="h-9 w-24 tabular-nums"
                  value={config.vehicleCount}
                  onChange={(e) => {
                    const v = Number(e.target.value);
                    if (!Number.isNaN(v))
                      updateConfig({
                        vehicleCount: Math.min(200, Math.max(10, v)),
                      });
                  }}
                />
              </div>
              <input
                id="vehicles"
                type="range"
                min={10}
                max={200}
                step={1}
                value={config.vehicleCount}
                onChange={(e) =>
                  updateConfig({ vehicleCount: Number(e.target.value) })
                }
                className="h-2 w-full cursor-pointer appearance-none rounded-full bg-muted accent-primary"
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between gap-4">
                <Label htmlFor="speed">Simulation speed</Label>
                <span className="text-sm tabular-nums text-muted-foreground">
                  {config.simulationSpeed.toFixed(1)}×
                </span>
              </div>
              <input
                id="speed"
                type="range"
                min={0.5}
                max={3}
                step={0.1}
                value={config.simulationSpeed}
                onChange={(e) =>
                  updateConfig({ simulationSpeed: Number(e.target.value) })
                }
                className="h-2 w-full cursor-pointer appearance-none rounded-full bg-muted accent-primary"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="grid">Grid size</Label>
                <Input
                  id="grid"
                  type="number"
                  min={4}
                  max={50}
                  value={config.gridSize}
                  onChange={(e) =>
                    updateConfig({ gridSize: Number(e.target.value) })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="inters">Intersection count</Label>
                <Input
                  id="inters"
                  type="number"
                  min={1}
                  max={32}
                  value={config.intersectionCount}
                  onChange={(e) =>
                    updateConfig({ intersectionCount: Number(e.target.value) })
                  }
                />
              </div>
            </div>

            <div className="flex items-center justify-between rounded-lg border border-border bg-muted/30 p-4">
              <div className="space-y-1">
                <Label htmlFor="rl" className="text-base">
                  Control policy
                </Label>
                <p className="text-xs text-muted-foreground">
                  {config.useRL
                    ? "DRL-optimized signal timing"
                    : "Fixed-time signal schedule"}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Fixed</span>
                <Switch
                  id="rl"
                  checked={config.useRL}
                  onCheckedChange={(v) => updateConfig({ useRL: v })}
                />
                <span className="text-xs font-medium text-primary">DRL</span>
              </div>
            </div>

            <Separator />

            <div className="flex flex-wrap gap-2">
              <Button
                className="flex-1 min-w-[120px]"
                onClick={() => handleStart()}
              >
                Start
              </Button>
              <Button
                variant="secondary"
                className="flex-1 min-w-[120px]"
                onClick={() => handleStop()}
              >
                Stop
              </Button>
              <Button
                variant="outline"
                className="flex-1 min-w-[120px]"
                onClick={() => handleReset()}
              >
                Reset
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-8">
          <CardHeader>
            <CardTitle>Visualization</CardTitle>
            <CardDescription>
              Canvas hook for the real-time renderer (WebGL / Canvas).
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TrafficCanvas state={displayState} />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricTile
          label="Avg wait time"
          value={metrics ? `${metrics.avgWaitTime.toFixed(2)}s` : "—"}
          icon={Timer}
        />
        <MetricTile
          label="Throughput"
          value={metrics ? `${metrics.throughput.toFixed(1)} veh/min` : "—"}
          icon={Gauge}
        />
        <MetricTile
          label="Queue length"
          value={metrics ? metrics.queueLength.toFixed(0) : "—"}
          icon={Layers}
        />
        <MetricTile
          label="Congestion index"
          value={metrics ? metrics.congestionIndex.toFixed(2) : "—"}
          icon={Activity}
        />
      </div>
    </div>
  );
}

function MetricTile({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon: ComponentType<{ className?: string }>;
}) {
  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {label}
        </CardTitle>
        <Icon className="h-4 w-4 text-primary" />
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold tabular-nums">{value}</p>
      </CardContent>
    </Card>
  );
}

import type {
  AnalyticsOverview,
  ComparisonData,
  Intersection,
  DRLModel,
  SimulationRun,
  TrafficMetric,
  User,
  SimulationConfig,
  SimulationState,
  SimulationMetrics,
  Vehicle,
  SimSignal,
} from "@/types";
import { UserRole } from "@/types";

export const DEMO_ADMIN: User = {
  id: "demo-admin-001",
  email: "admin@itms.com",
  name: "System Administrator",
  role: UserRole.ADMIN,
  createdAt: new Date().toISOString(),
};

export const DEMO_USERS: User[] = [
  DEMO_ADMIN,
  {
    id: "demo-operator-001",
    email: "operator@itms.com",
    name: "Traffic Operator",
    role: UserRole.OPERATOR,
    createdAt: new Date().toISOString(),
  },
  {
    id: "demo-viewer-001",
    email: "viewer@itms.com",
    name: "Dashboard Viewer",
    role: UserRole.VIEWER,
    createdAt: new Date().toISOString(),
  },
];

export const DEMO_OVERVIEW: AnalyticsOverview = {
  totalIntersections: 12,
  activeSimulations: 0,
  avgWaitTime: 24.5,
  avgThroughput: 1250,
  congestionIndex: 0.42,
  improvementPercent: 35,
};

export const DEMO_COMPARISON: ComparisonData[] = [
  { metric: "Average Wait Time (s)", fixedTime: 45.2, drlOptimized: 28.7, improvement: 36.5 },
  { metric: "Throughput (vehicles/hr)", fixedTime: 850, drlOptimized: 1240, improvement: 45.9 },
  { metric: "Average Speed (km/h)", fixedTime: 22.3, drlOptimized: 31.8, improvement: 42.6 },
  { metric: "Queue Length", fixedTime: 18.5, drlOptimized: 8.2, improvement: 55.7 },
  { metric: "Congestion Index", fixedTime: 0.72, drlOptimized: 0.38, improvement: 47.2 },
  { metric: "Fuel Efficiency (%)", fixedTime: 65, drlOptimized: 82, improvement: 26.2 },
];

export const DEMO_INTERSECTIONS: Intersection[] = [
  { id: "int-001", name: "FUTA Main Gate Junction", latitude: 7.3034, longitude: 5.1377, laneCount: 4, capacity: 120, status: "ACTIVE", createdAt: new Date().toISOString() },
  { id: "int-002", name: "Alagbaka Roundabout", latitude: 7.2571, longitude: 5.2058, laneCount: 6, capacity: 200, status: "ACTIVE", createdAt: new Date().toISOString() },
  { id: "int-003", name: "Oba Adesida Road Junction", latitude: 7.2526, longitude: 5.1950, laneCount: 4, capacity: 150, status: "ACTIVE", createdAt: new Date().toISOString() },
  { id: "int-004", name: "Ondo Road Intersection", latitude: 7.2480, longitude: 5.2100, laneCount: 4, capacity: 130, status: "ACTIVE", createdAt: new Date().toISOString() },
  { id: "int-005", name: "Hospital Road Junction", latitude: 7.2600, longitude: 5.1900, laneCount: 3, capacity: 90, status: "ACTIVE", createdAt: new Date().toISOString() },
  { id: "int-006", name: "Oyemekun Road Junction", latitude: 7.2550, longitude: 5.2020, laneCount: 4, capacity: 140, status: "MAINTENANCE", createdAt: new Date().toISOString() },
  { id: "int-007", name: "NEPA Roundabout", latitude: 7.2510, longitude: 5.1980, laneCount: 5, capacity: 180, status: "ACTIVE", createdAt: new Date().toISOString() },
  { id: "int-008", name: "Ijapo Estate Junction", latitude: 7.2650, longitude: 5.2150, laneCount: 3, capacity: 100, status: "ACTIVE", createdAt: new Date().toISOString() },
  { id: "int-009", name: "Shagari Village Junction", latitude: 7.2700, longitude: 5.1850, laneCount: 4, capacity: 110, status: "INACTIVE", createdAt: new Date().toISOString() },
  { id: "int-010", name: "Adekunle Ajasin Road", latitude: 7.2450, longitude: 5.2000, laneCount: 4, capacity: 135, status: "ACTIVE", createdAt: new Date().toISOString() },
  { id: "int-011", name: "Cathedral Junction", latitude: 7.2530, longitude: 5.1930, laneCount: 3, capacity: 95, status: "ACTIVE", createdAt: new Date().toISOString() },
  { id: "int-012", name: "Market Square Intersection", latitude: 7.2490, longitude: 5.1960, laneCount: 4, capacity: 160, status: "ACTIVE", createdAt: new Date().toISOString() },
];

export const DEMO_DRL_MODELS: DRLModel[] = [
  {
    id: "model-001",
    name: "DQN-v1-baseline",
    config: { learningRate: 0.001, discountFactor: 0.99, epsilon: 1.0, epsilonDecay: 0.995, episodes: 500, batchSize: 64 },
    episodes: 500,
    bestReward: 12.45,
    status: "COMPLETED",
    createdAt: new Date(Date.now() - 7 * 24 * 3600000).toISOString(),
  },
  {
    id: "model-002",
    name: "DQN-v2-optimized",
    config: { learningRate: 0.0005, discountFactor: 0.95, epsilon: 1.0, epsilonDecay: 0.998, episodes: 1000, batchSize: 128 },
    episodes: 1000,
    bestReward: 18.73,
    status: "COMPLETED",
    createdAt: new Date(Date.now() - 3 * 24 * 3600000).toISOString(),
  },
  {
    id: "model-003",
    name: "Q-Learning-experimental",
    config: { learningRate: 0.1, discountFactor: 0.9, epsilon: 1.0, epsilonDecay: 0.99, episodes: 200, batchSize: 32 },
    episodes: 200,
    bestReward: 8.92,
    status: "COMPLETED",
    createdAt: new Date(Date.now() - 1 * 24 * 3600000).toISOString(),
  },
];

export const DEMO_SIMULATION_RUNS: SimulationRun[] = [
  {
    id: "run-001",
    userId: "demo-admin-001",
    config: { vehicleCount: 50, simulationSpeed: 1, gridSize: 500, intersectionCount: 4, useRL: false },
    status: "COMPLETED",
    startedAt: new Date(Date.now() - 5 * 24 * 3600000).toISOString(),
    completedAt: new Date(Date.now() - 5 * 24 * 3600000 + 300000).toISOString(),
    results: { avgWaitTime: 45.2, throughput: 850, avgSpeed: 22.3, queueLength: 18.5, congestionIndex: 0.72, totalVehiclesProcessed: 340 },
  },
  {
    id: "run-002",
    userId: "demo-admin-001",
    config: { vehicleCount: 50, simulationSpeed: 1, gridSize: 500, intersectionCount: 4, useRL: true },
    status: "COMPLETED",
    startedAt: new Date(Date.now() - 4 * 24 * 3600000).toISOString(),
    completedAt: new Date(Date.now() - 4 * 24 * 3600000 + 300000).toISOString(),
    results: { avgWaitTime: 28.7, throughput: 1240, avgSpeed: 31.8, queueLength: 8.2, congestionIndex: 0.38, totalVehiclesProcessed: 496 },
  },
  {
    id: "run-003",
    userId: "demo-admin-001",
    config: { vehicleCount: 100, simulationSpeed: 1.5, gridSize: 500, intersectionCount: 9, useRL: false },
    status: "COMPLETED",
    startedAt: new Date(Date.now() - 2 * 24 * 3600000).toISOString(),
    completedAt: new Date(Date.now() - 2 * 24 * 3600000 + 450000).toISOString(),
    results: { avgWaitTime: 52.1, throughput: 720, avgSpeed: 19.5, queueLength: 24.3, congestionIndex: 0.81, totalVehiclesProcessed: 288 },
  },
  {
    id: "run-004",
    userId: "demo-admin-001",
    config: { vehicleCount: 100, simulationSpeed: 1.5, gridSize: 500, intersectionCount: 9, useRL: true },
    status: "COMPLETED",
    startedAt: new Date(Date.now() - 1 * 24 * 3600000).toISOString(),
    completedAt: new Date(Date.now() - 1 * 24 * 3600000 + 450000).toISOString(),
    results: { avgWaitTime: 31.4, throughput: 1150, avgSpeed: 29.6, queueLength: 10.1, congestionIndex: 0.44, totalVehiclesProcessed: 460 },
  },
];

export function generateDemoTrafficMetrics(): TrafficMetric[] {
  const metrics: TrafficMetric[] = [];
  const now = new Date();
  const intersectionIds = DEMO_INTERSECTIONS.map(i => i.id);

  for (const intId of intersectionIds.slice(0, 4)) {
    for (let h = 0; h < 24; h++) {
      const timestamp = new Date(now);
      timestamp.setHours(h, 0, 0, 0);
      const isPeak = (h >= 7 && h <= 9) || (h >= 16 && h <= 18);
      metrics.push({
        id: `metric-${intId}-${h}`,
        intersectionId: intId,
        timestamp: timestamp.toISOString(),
        avgWaitTime: isPeak ? 30 + Math.random() * 25 : 10 + Math.random() * 15,
        throughput: isPeak ? 150 + Math.floor(Math.random() * 100) : 50 + Math.floor(Math.random() * 80),
        queueLength: isPeak ? 12 + Math.floor(Math.random() * 10) : 2 + Math.floor(Math.random() * 6),
        congestionIndex: isPeak ? 0.6 + Math.random() * 0.3 : 0.1 + Math.random() * 0.3,
      });
    }
  }
  return metrics;
}

const phaseRot = ["RED", "YELLOW", "GREEN"] as const;

/** Local-only simulation state when the WebSocket backend is unavailable */
export function generateDemoSimulationState(
  tick: number,
  config: SimulationConfig,
): SimulationState {
  const gridSize = Math.max(config.gridSize * 20, 200);
  const count = Math.min(Math.max(1, config.intersectionCount), 9);
  const signals: SimSignal[] = [];
  for (let i = 0; i < count; i++) {
    const col = i % 3;
    const row = Math.floor(i / 3);
    const x = 80 + col * (gridSize / 3.5);
    const y = 80 + row * (gridSize / 3.5);
    const ns = phaseRot[(tick + i) % 3];
    const ew = phaseRot[(tick + i + 1) % 3];
    signals.push({
      id: i,
      x,
      y,
      phases: { NS: ns, EW: ew },
      timer: tick % 40,
    });
  }

  const vehicles: Vehicle[] = [];
  const vc = Math.min(Math.max(10, config.vehicleCount), 48);
  for (let v = 0; v < vc; v++) {
    const t = tick + v * 7;
    vehicles.push({
      id: v,
      x: 40 + ((t * 11) % Math.max(80, gridSize - 80)),
      y: 40 + ((t * 13) % Math.max(80, gridSize - 80)),
      direction: (["N", "S", "E", "W"] as const)[v % 4],
      speed: 1 + (v % 3),
      waiting: v % 13 === 0,
    });
  }

  const metrics: SimulationMetrics = {
    avgWaitTime: 28 + Math.sin(tick / 20) * 5,
    throughput: 12 + Math.sin(tick / 15) * 4,
    avgSpeed: 25 + Math.sin(tick / 18) * 3,
    queueLength: 8 + Math.sin(tick / 10) * 3,
    congestionIndex: Math.min(0.95, Math.max(0.1, 0.4 + Math.sin(tick / 25) * 0.12)),
    totalVehiclesProcessed: tick * 3 + vc,
  };

  return {
    vehicles,
    signals,
    metrics,
    tick,
    running: true,
  };
}

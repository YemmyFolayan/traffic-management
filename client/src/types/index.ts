export enum UserRole {
  ADMIN = "ADMIN",
  OPERATOR = "OPERATOR",
  VIEWER = "VIEWER",
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  name: string;
  role: UserRole;
}

export interface ApiResponse<T> {
  entity: T;
  error: ApiError | null;
  status: boolean;
}

export interface ApiError {
  code: string;
  message: string;
}

export interface Intersection {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  laneCount: number;
  capacity: number;
  status: "ACTIVE" | "INACTIVE" | "MAINTENANCE";
  createdAt: string;
  signals?: TrafficSignal[];
}

export interface TrafficSignal {
  id: string;
  intersectionId: string;
  direction: "NORTH" | "SOUTH" | "EAST" | "WEST";
  currentPhase: "RED" | "YELLOW" | "GREEN";
  greenDuration: number;
  yellowDuration: number;
  redDuration: number;
}

export interface SimulationConfig {
  vehicleCount: number;
  simulationSpeed: number;
  gridSize: number;
  intersectionCount: number;
  useRL: boolean;
}

export interface SimulationState {
  vehicles: Vehicle[];
  signals: SimSignal[];
  metrics: SimulationMetrics;
  tick: number;
  running: boolean;
}

export interface Vehicle {
  id: number;
  x: number;
  y: number;
  direction: "N" | "S" | "E" | "W";
  speed: number;
  waiting: boolean;
}

export interface SimSignal {
  id: number;
  x: number;
  y: number;
  phases: Record<string, "RED" | "YELLOW" | "GREEN">;
  timer: number;
}

export interface SimulationMetrics {
  avgWaitTime: number;
  throughput: number;
  avgSpeed: number;
  queueLength: number;
  congestionIndex: number;
  totalVehiclesProcessed: number;
}

export interface SimulationRun {
  id: string;
  userId: string;
  config: SimulationConfig;
  status: "RUNNING" | "COMPLETED" | "FAILED";
  startedAt: string;
  completedAt?: string;
  results?: SimulationMetrics;
}

export interface TrafficMetric {
  id: string;
  intersectionId: string;
  timestamp: string;
  avgWaitTime: number;
  throughput: number;
  queueLength: number;
  congestionIndex: number;
}

export interface DRLModel {
  id: string;
  name: string;
  config: DRLConfig;
  episodes: number;
  bestReward: number;
  status: "TRAINING" | "COMPLETED" | "FAILED";
  createdAt: string;
}

export interface DRLConfig {
  learningRate: number;
  discountFactor: number;
  epsilon: number;
  epsilonDecay: number;
  episodes: number;
  batchSize: number;
}

export interface TrainingProgress {
  episode: number;
  reward: number;
  avgWaitTime: number;
  epsilon: number;
  loss: number;
}

export interface AnalyticsOverview {
  totalIntersections: number;
  activeSimulations: number;
  avgWaitTime: number;
  avgThroughput: number;
  congestionIndex: number;
  improvementPercent: number;
}

export interface ComparisonData {
  metric: string;
  fixedTime: number;
  drlOptimized: number;
  improvement: number;
}

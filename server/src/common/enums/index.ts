export enum UserRole {
  ADMIN = 'ADMIN',
  OPERATOR = 'OPERATOR',
  VIEWER = 'VIEWER',
}

export enum SignalPhase {
  RED = 'RED',
  YELLOW = 'YELLOW',
  GREEN = 'GREEN',
}

export enum SignalDirection {
  NORTH = 'NORTH',
  SOUTH = 'SOUTH',
  EAST = 'EAST',
  WEST = 'WEST',
}

export enum IntersectionStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  MAINTENANCE = 'MAINTENANCE',
}

export enum SimulationStatus {
  RUNNING = 'RUNNING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

export enum DRLModelStatus {
  TRAINING = 'TRAINING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

import { Injectable } from '@nestjs/common';

interface Vehicle {
  id: number;
  x: number;
  y: number;
  direction: 'N' | 'S' | 'E' | 'W';
  speed: number;
  waiting: boolean;
  waitTime: number;
}

interface Signal {
  id: number;
  x: number;
  y: number;
  phases: Record<string, 'RED' | 'YELLOW' | 'GREEN'>;
  timer: number;
  cycleLength: number;
}

interface SimConfig {
  vehicleCount: number;
  simulationSpeed: number;
  gridSize: number;
  intersectionCount: number;
  useRL: boolean;
}

interface SimMetrics {
  avgWaitTime: number;
  throughput: number;
  avgSpeed: number;
  queueLength: number;
  congestionIndex: number;
  totalVehiclesProcessed: number;
}

@Injectable()
export class SimulationEngine {
  private vehicles: Vehicle[] = [];
  private signals: Signal[] = [];
  private config!: SimConfig;
  private tick = 0;
  private running = false;
  private totalProcessed = 0;
  private totalWaitTime = 0;
  private intervalId: NodeJS.Timeout | null = null;

  initialize(config: SimConfig) {
    this.config = config;
    this.tick = 0;
    this.totalProcessed = 0;
    this.totalWaitTime = 0;
    this.running = false;

    this.signals = [];
    const spacing = config.gridSize / (Math.sqrt(config.intersectionCount) + 1);
    const gridDim = Math.ceil(Math.sqrt(config.intersectionCount));

    let signalId = 0;
    for (let row = 0; row < gridDim; row++) {
      for (let col = 0; col < gridDim; col++) {
        if (signalId >= config.intersectionCount) break;
        this.signals.push({
          id: signalId++,
          x: Math.round(spacing * (col + 1)),
          y: Math.round(spacing * (row + 1)),
          phases: {
            NS: row % 2 === 0 ? 'GREEN' : 'RED',
            EW: row % 2 === 0 ? 'RED' : 'GREEN',
          },
          timer: 0,
          cycleLength: config.useRL ? 20 : 30,
        });
      }
    }

    this.vehicles = [];
    for (let i = 0; i < config.vehicleCount; i++) {
      this.vehicles.push(this.createRandomVehicle(i));
    }
  }

  private createRandomVehicle(id: number): Vehicle {
    const directions: Array<'N' | 'S' | 'E' | 'W'> = ['N', 'S', 'E', 'W'];
    const dir = directions[Math.floor(Math.random() * 4)];
    const gs = this.config.gridSize;

    let x: number, y: number;
    switch (dir) {
      case 'N':
        x = Math.random() * gs;
        y = gs;
        break;
      case 'S':
        x = Math.random() * gs;
        y = 0;
        break;
      case 'E':
        x = 0;
        y = Math.random() * gs;
        break;
      case 'W':
        x = gs;
        y = Math.random() * gs;
        break;
    }

    return {
      id,
      x: Math.round(x),
      y: Math.round(y),
      direction: dir,
      speed: 1 + Math.random() * 2,
      waiting: false,
      waitTime: 0,
    };
  }

  step(): {
    vehicles: Vehicle[];
    signals: Signal[];
    metrics: SimMetrics;
    tick: number;
    running: boolean;
  } {
    this.tick++;

    // Update signal phases
    for (const signal of this.signals) {
      signal.timer++;
      if (signal.timer >= signal.cycleLength) {
        signal.timer = 0;
        if (signal.phases.NS === 'GREEN') {
          signal.phases.NS = 'YELLOW';
          signal.phases.EW = 'RED';
        } else if (signal.phases.NS === 'YELLOW') {
          signal.phases.NS = 'RED';
          signal.phases.EW = 'GREEN';
        } else if (signal.phases.EW === 'GREEN') {
          signal.phases.EW = 'YELLOW';
          signal.phases.NS = 'RED';
        } else {
          signal.phases.EW = 'RED';
          signal.phases.NS = 'GREEN';
        }
      }
    }

    // RL-optimized signals adapt based on queue
    if (this.config.useRL) {
      for (const signal of this.signals) {
        const nearbyVehicles = this.vehicles.filter(v => {
          const dist = Math.sqrt((v.x - signal.x) ** 2 + (v.y - signal.y) ** 2);
          return dist < 30 && v.waiting;
        });

        const nsWaiting = nearbyVehicles.filter(v => v.direction === 'N' || v.direction === 'S').length;
        const ewWaiting = nearbyVehicles.filter(v => v.direction === 'E' || v.direction === 'W').length;

        if (nsWaiting > ewWaiting + 3 && signal.phases.NS === 'RED' && signal.timer > 10) {
          signal.phases.NS = 'GREEN';
          signal.phases.EW = 'RED';
          signal.timer = 0;
        } else if (ewWaiting > nsWaiting + 3 && signal.phases.EW === 'RED' && signal.timer > 10) {
          signal.phases.EW = 'GREEN';
          signal.phases.NS = 'RED';
          signal.timer = 0;
        }
      }
    }

    // Move vehicles
    let queueLength = 0;
    for (const vehicle of this.vehicles) {
      const nearSignal = this.signals.find(s => {
        const dist = Math.sqrt((vehicle.x - s.x) ** 2 + (vehicle.y - s.y) ** 2);
        return dist < 15;
      });

      let shouldStop = false;
      if (nearSignal) {
        const isNS = vehicle.direction === 'N' || vehicle.direction === 'S';
        const phase = isNS ? nearSignal.phases.NS : nearSignal.phases.EW;
        if (phase === 'RED' || phase === 'YELLOW') {
          shouldStop = true;
        }
      }

      if (shouldStop) {
        vehicle.waiting = true;
        vehicle.waitTime++;
        this.totalWaitTime++;
        queueLength++;
      } else {
        vehicle.waiting = false;
        const speed = vehicle.speed * this.config.simulationSpeed;
        switch (vehicle.direction) {
          case 'N':
            vehicle.y -= speed;
            break;
          case 'S':
            vehicle.y += speed;
            break;
          case 'E':
            vehicle.x += speed;
            break;
          case 'W':
            vehicle.x -= speed;
            break;
        }
      }

      // Respawn if out of bounds
      const gs = this.config.gridSize;
      if (vehicle.x < -10 || vehicle.x > gs + 10 || vehicle.y < -10 || vehicle.y > gs + 10) {
        this.totalProcessed++;
        const newVehicle = this.createRandomVehicle(vehicle.id);
        vehicle.x = newVehicle.x;
        vehicle.y = newVehicle.y;
        vehicle.direction = newVehicle.direction;
        vehicle.speed = newVehicle.speed;
        vehicle.waiting = false;
        vehicle.waitTime = 0;
      }
    }

    const activeVehicles = this.vehicles.filter(v => !v.waiting);
    const avgSpeed =
      activeVehicles.length > 0
        ? activeVehicles.reduce((sum, v) => sum + v.speed, 0) / activeVehicles.length
        : 0;

    const metrics: SimMetrics = {
      avgWaitTime: this.tick > 0 ? this.totalWaitTime / Math.max(this.tick, 1) : 0,
      throughput: this.totalProcessed,
      avgSpeed: Math.round(avgSpeed * 100) / 100,
      queueLength,
      congestionIndex: Math.min(queueLength / Math.max(this.config.vehicleCount, 1), 1),
      totalVehiclesProcessed: this.totalProcessed,
    };

    return {
      vehicles: this.vehicles,
      signals: this.signals,
      metrics,
      tick: this.tick,
      running: this.running,
    };
  }

  start() {
    this.running = true;
  }

  stop() {
    this.running = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  reset() {
    this.stop();
    if (this.config) {
      this.initialize(this.config);
    }
  }

  isRunning() {
    return this.running;
  }

  getState() {
    return {
      vehicles: this.vehicles,
      signals: this.signals,
      metrics: {
        avgWaitTime: this.tick > 0 ? this.totalWaitTime / Math.max(this.tick, 1) : 0,
        throughput: this.totalProcessed,
        avgSpeed: 0,
        queueLength: this.vehicles.filter(v => v.waiting).length,
        congestionIndex: 0,
        totalVehiclesProcessed: this.totalProcessed,
      },
      tick: this.tick,
      running: this.running,
    };
  }
}

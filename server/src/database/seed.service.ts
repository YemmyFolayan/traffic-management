import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User, Intersection, TrafficSignal, TrafficMetric, SimulationRun, DRLModel } from './entities';
import {
  UserRole,
  IntersectionStatus,
  SignalDirection,
  SignalPhase,
  SimulationStatus,
  DRLModelStatus,
} from '../common/enums';

@Injectable()
export class SeedService implements OnModuleInit {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Intersection) private intersectionRepo: Repository<Intersection>,
    @InjectRepository(TrafficSignal) private signalRepo: Repository<TrafficSignal>,
    @InjectRepository(TrafficMetric) private metricRepo: Repository<TrafficMetric>,
    @InjectRepository(SimulationRun) private simRunRepo: Repository<SimulationRun>,
    @InjectRepository(DRLModel) private modelRepo: Repository<DRLModel>,
  ) {}

  async onModuleInit() {
    await this.seedUsers();
    await this.seedIntersections();
    await this.seedSimulationRuns();
    await this.seedDRLModels();
  }

  private async seedUsers() {
    const count = await this.userRepo.count();
    if (count > 0) {
      this.logger.log('Users already seeded, skipping...');
      return;
    }

    this.logger.log('Seeding default users...');
    const hashedPassword = await bcrypt.hash('admin123', 10);

    const users = [
      {
        email: 'admin@itms.com',
        password: hashedPassword,
        name: 'System Administrator',
        role: UserRole.ADMIN,
      },
      {
        email: 'operator@itms.com',
        password: await bcrypt.hash('operator123', 10),
        name: 'Traffic Operator',
        role: UserRole.OPERATOR,
      },
      {
        email: 'viewer@itms.com',
        password: await bcrypt.hash('viewer123', 10),
        name: 'Dashboard Viewer',
        role: UserRole.VIEWER,
      },
    ];

    for (const userData of users) {
      const user = this.userRepo.create(userData);
      await this.userRepo.save(user);
      this.logger.log(`Created user: ${userData.email} (${userData.role})`);
    }
  }

  private async seedIntersections() {
    const count = await this.intersectionRepo.count();
    if (count > 0) {
      this.logger.log('Intersections already seeded, skipping...');
      return;
    }

    this.logger.log('Seeding sample intersections...');

    const intersections = [
      { name: 'FUTA Main Gate Junction', latitude: 7.3034, longitude: 5.1377, laneCount: 4, capacity: 120 },
      { name: 'Alagbaka Roundabout', latitude: 7.2571, longitude: 5.2058, laneCount: 6, capacity: 200 },
      { name: 'Oba Adesida Road Junction', latitude: 7.2526, longitude: 5.195, laneCount: 4, capacity: 150 },
      { name: 'Ondo Road Intersection', latitude: 7.248, longitude: 5.21, laneCount: 4, capacity: 130 },
      { name: 'Hospital Road Junction', latitude: 7.26, longitude: 5.19, laneCount: 3, capacity: 90 },
      { name: 'Oyemekun Road Junction', latitude: 7.255, longitude: 5.202, laneCount: 4, capacity: 140 },
      { name: 'NEPA Roundabout', latitude: 7.251, longitude: 5.198, laneCount: 5, capacity: 180 },
      { name: 'Ijapo Estate Junction', latitude: 7.265, longitude: 5.215, laneCount: 3, capacity: 100 },
      { name: 'Shagari Village Junction', latitude: 7.27, longitude: 5.185, laneCount: 4, capacity: 110 },
      { name: 'Adekunle Ajasin Road', latitude: 7.245, longitude: 5.2, laneCount: 4, capacity: 135 },
      { name: 'Cathedral Junction', latitude: 7.253, longitude: 5.193, laneCount: 3, capacity: 95 },
      { name: 'Market Square Intersection', latitude: 7.249, longitude: 5.196, laneCount: 4, capacity: 160 },
    ];

    const directions = [SignalDirection.NORTH, SignalDirection.SOUTH, SignalDirection.EAST, SignalDirection.WEST];

    for (const data of intersections) {
      const intersection = this.intersectionRepo.create({
        ...data,
        status: IntersectionStatus.ACTIVE,
      });
      const saved = await this.intersectionRepo.save(intersection);

      const signals = directions.map((direction, i) =>
        this.signalRepo.create({
          intersectionId: saved.id,
          direction,
          currentPhase: i === 0 ? SignalPhase.GREEN : SignalPhase.RED,
          greenDuration: 25 + Math.floor(Math.random() * 15),
          yellowDuration: 5,
          redDuration: 25 + Math.floor(Math.random() * 15),
        }),
      );
      await this.signalRepo.save(signals);

      const now = new Date();
      const metricsData = [];
      for (let h = 0; h < 24; h++) {
        const timestamp = new Date(now);
        timestamp.setHours(h, 0, 0, 0);
        const isPeak = (h >= 7 && h <= 9) || (h >= 16 && h <= 18);
        metricsData.push(
          this.metricRepo.create({
            intersectionId: saved.id,
            timestamp,
            avgWaitTime: isPeak ? 30 + Math.random() * 25 : 10 + Math.random() * 15,
            throughput: isPeak ? 150 + Math.floor(Math.random() * 100) : 50 + Math.floor(Math.random() * 80),
            queueLength: isPeak ? 12 + Math.floor(Math.random() * 10) : 2 + Math.floor(Math.random() * 6),
            congestionIndex: isPeak ? 0.6 + Math.random() * 0.3 : 0.1 + Math.random() * 0.3,
          }),
        );
      }
      await this.metricRepo.save(metricsData);
    }

    this.logger.log(`Seeded ${intersections.length} intersections with signals and metrics`);
  }

  private async seedSimulationRuns() {
    const count = await this.simRunRepo.count();
    if (count > 0) {
      this.logger.log('Simulation runs already seeded, skipping...');
      return;
    }

    const admin = await this.userRepo.findOne({ where: { email: 'admin@itms.com' } });
    if (!admin) {
      this.logger.warn('Admin user not found; skipping simulation run seed');
      return;
    }

    this.logger.log('Seeding sample simulation runs...');

    const runs = [
      {
        userId: admin.id,
        config: { vehicleCount: 50, simulationSpeed: 1, gridSize: 500, intersectionCount: 4, useRL: false },
        status: SimulationStatus.COMPLETED,
        completedAt: new Date(),
        results: {
          avgWaitTime: 45.2,
          throughput: 850,
          avgSpeed: 22.3,
          queueLength: 18.5,
          congestionIndex: 0.72,
          totalVehiclesProcessed: 340,
        },
      },
      {
        userId: admin.id,
        config: { vehicleCount: 50, simulationSpeed: 1, gridSize: 500, intersectionCount: 4, useRL: true },
        status: SimulationStatus.COMPLETED,
        completedAt: new Date(),
        results: {
          avgWaitTime: 28.7,
          throughput: 1240,
          avgSpeed: 31.8,
          queueLength: 8.2,
          congestionIndex: 0.38,
          totalVehiclesProcessed: 496,
        },
      },
      {
        userId: admin.id,
        config: { vehicleCount: 100, simulationSpeed: 1.5, gridSize: 500, intersectionCount: 9, useRL: false },
        status: SimulationStatus.COMPLETED,
        completedAt: new Date(),
        results: {
          avgWaitTime: 52.1,
          throughput: 720,
          avgSpeed: 19.5,
          queueLength: 24.3,
          congestionIndex: 0.81,
          totalVehiclesProcessed: 288,
        },
      },
      {
        userId: admin.id,
        config: { vehicleCount: 100, simulationSpeed: 1.5, gridSize: 500, intersectionCount: 9, useRL: true },
        status: SimulationStatus.COMPLETED,
        completedAt: new Date(),
        results: {
          avgWaitTime: 31.4,
          throughput: 1150,
          avgSpeed: 29.6,
          queueLength: 10.1,
          congestionIndex: 0.44,
          totalVehiclesProcessed: 460,
        },
      },
      {
        userId: admin.id,
        config: { vehicleCount: 150, simulationSpeed: 2, gridSize: 500, intersectionCount: 16, useRL: true },
        status: SimulationStatus.COMPLETED,
        completedAt: new Date(),
        results: {
          avgWaitTime: 34.8,
          throughput: 1080,
          avgSpeed: 27.2,
          queueLength: 13.5,
          congestionIndex: 0.52,
          totalVehiclesProcessed: 432,
        },
      },
    ];

    for (const runData of runs) {
      const run = this.simRunRepo.create(runData);
      await this.simRunRepo.save(run);
    }

    this.logger.log(`Seeded ${runs.length} simulation runs`);
  }

  private async seedDRLModels() {
    const count = await this.modelRepo.count();
    if (count > 0) {
      this.logger.log('DRL models already seeded, skipping...');
      return;
    }

    this.logger.log('Seeding sample DRL models...');

    const trainingHistory = Array.from({ length: 100 }, (_, i) => ({
      episode: i + 1,
      reward: -50 + i * 0.6 + Math.sin(i / 10) * 5 + (Math.random() - 0.5) * 8,
      avgWaitTime: 55 - i * 0.3 + (Math.random() - 0.5) * 5,
      epsilon: Math.max(0.01, 1.0 * Math.pow(0.995, i)),
      loss: Math.max(0.01, 2 - i * 0.015 + (Math.random() - 0.5) * 0.3),
    }));

    const models = [
      {
        name: 'DQN-v1-baseline',
        config: {
          learningRate: 0.001,
          discountFactor: 0.99,
          epsilon: 1.0,
          epsilonDecay: 0.995,
          episodes: 500,
          batchSize: 64,
        },
        episodes: 500,
        bestReward: 12.45,
        status: DRLModelStatus.COMPLETED,
        trainingHistory,
      },
      {
        name: 'DQN-v2-optimized',
        config: {
          learningRate: 0.0005,
          discountFactor: 0.95,
          epsilon: 1.0,
          epsilonDecay: 0.998,
          episodes: 1000,
          batchSize: 128,
        },
        episodes: 1000,
        bestReward: 18.73,
        status: DRLModelStatus.COMPLETED,
        trainingHistory: trainingHistory.map((h) => ({
          ...h,
          reward: h.reward * 1.3 + 5,
          avgWaitTime: h.avgWaitTime * 0.85,
        })),
      },
      {
        name: 'Q-Learning-experimental',
        config: {
          learningRate: 0.1,
          discountFactor: 0.9,
          epsilon: 1.0,
          epsilonDecay: 0.99,
          episodes: 200,
          batchSize: 32,
        },
        episodes: 200,
        bestReward: 8.92,
        status: DRLModelStatus.COMPLETED,
        trainingHistory: trainingHistory.slice(0, 40),
      },
    ];

    for (const modelData of models) {
      const model = this.modelRepo.create(modelData);
      await this.modelRepo.save(model);
    }

    this.logger.log(`Seeded ${models.length} DRL models`);
  }
}

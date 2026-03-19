import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SimulationRun } from '../database/entities';
import { SimulationStatus } from '../common/enums';

@Injectable()
export class SimulationService {
  constructor(
    @InjectRepository(SimulationRun)
    private readonly simRunRepo: Repository<SimulationRun>,
  ) {}

  async createRun(userId: string, config: Record<string, unknown>) {
    const run = this.simRunRepo.create({
      userId,
      config,
      status: SimulationStatus.RUNNING,
    });
    return this.simRunRepo.save(run);
  }

  async completeRun(id: string, results: Record<string, unknown>) {
    await this.simRunRepo.update(id, {
      status: SimulationStatus.COMPLETED,
      completedAt: new Date(),
      results: results as Record<string, any>,
    });
    return this.simRunRepo.findOne({ where: { id } });
  }

  async failRun(id: string) {
    await this.simRunRepo.update(id, {
      status: SimulationStatus.FAILED,
      completedAt: new Date(),
    });
  }

  async getHistory(userId?: string) {
    const where: { userId?: string } = {};
    if (userId) where.userId = userId;
    return this.simRunRepo.find({
      where,
      order: { startedAt: 'DESC' },
      take: 50,
    });
  }

  async getRunningCount() {
    return this.simRunRepo.count({ where: { status: SimulationStatus.RUNNING } });
  }
}

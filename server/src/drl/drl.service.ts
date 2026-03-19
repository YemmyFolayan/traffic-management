import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DRLModel } from '../database/entities';
import { DRLEngine } from './drl.engine';
import { DRLModelStatus } from '../common/enums';

@Injectable()
export class DRLService {
  constructor(
    @InjectRepository(DRLModel)
    private readonly modelRepo: Repository<DRLModel>,
    private readonly engine: DRLEngine,
  ) {}

  async startTraining(config: Record<string, unknown>) {
    const model = this.modelRepo.create({
      name: (config.name as string) || `Model-${Date.now()}`,
      config,
      status: DRLModelStatus.TRAINING,
    });
    const saved = await this.modelRepo.save(model);

    const trainingConfig = {
      learningRate: (config.learningRate as number) || 0.1,
      discountFactor: (config.discountFactor as number) || 0.95,
      epsilon: (config.epsilon as number) || 1.0,
      epsilonDecay: (config.epsilonDecay as number) || 0.995,
      episodes: (config.episodes as number) || 500,
      batchSize: (config.batchSize as number) || 32,
    };

    this.engine
      .train(trainingConfig)
      .then(async history => {
        await this.modelRepo.update(saved.id, {
          status: DRLModelStatus.COMPLETED,
          episodes: history.length,
          bestReward: this.engine.getBestReward(),
          trainingHistory: history as unknown as Record<string, any>[],
        });
      })
      .catch(async () => {
        await this.modelRepo.update(saved.id, {
          status: DRLModelStatus.FAILED,
        });
      });

    return saved;
  }

  async getModels() {
    return this.modelRepo.find({ order: { createdAt: 'DESC' } });
  }

  async getModel(id: string) {
    const model = await this.modelRepo.findOne({ where: { id } });
    if (!model) throw new NotFoundException('Model not found');
    return model;
  }

  getTrainingProgress() {
    return this.engine.getProgress();
  }

  stopTraining() {
    this.engine.stopTraining();
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Intersection, TrafficSignal, TrafficMetric } from '../database/entities';
import { CreateIntersectionDto } from './dto/create-intersection.dto';
import { UpdateIntersectionDto } from './dto/update-intersection.dto';
import { UpdateSignalDto } from './dto/update-signal.dto';
import { SignalDirection, SignalPhase } from '../common/enums';

@Injectable()
export class TrafficService {
  constructor(
    @InjectRepository(Intersection)
    private readonly intersectionRepo: Repository<Intersection>,
    @InjectRepository(TrafficSignal)
    private readonly signalRepo: Repository<TrafficSignal>,
    @InjectRepository(TrafficMetric)
    private readonly metricRepo: Repository<TrafficMetric>,
  ) {}

  async createIntersection(dto: CreateIntersectionDto, userId: string) {
    const intersection = this.intersectionRepo.create({
      ...dto,
      createdBy: userId,
    });
    const saved = await this.intersectionRepo.save(intersection);

    const directions = [SignalDirection.NORTH, SignalDirection.SOUTH, SignalDirection.EAST, SignalDirection.WEST];
    const signals = directions.map(direction =>
      this.signalRepo.create({
        intersectionId: saved.id,
        direction,
        currentPhase: direction === SignalDirection.NORTH ? SignalPhase.GREEN : SignalPhase.RED,
      }),
    );
    await this.signalRepo.save(signals);

    return this.findOneIntersection(saved.id);
  }

  async findAllIntersections() {
    return this.intersectionRepo.find({
      relations: ['signals'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOneIntersection(id: string) {
    const intersection = await this.intersectionRepo.findOne({
      where: { id },
      relations: ['signals'],
    });
    if (!intersection) throw new NotFoundException('Intersection not found');
    return intersection;
  }

  async updateIntersection(id: string, dto: UpdateIntersectionDto) {
    const intersection = await this.findOneIntersection(id);
    Object.assign(intersection, dto);
    return this.intersectionRepo.save(intersection);
  }

  async deleteIntersection(id: string) {
    const intersection = await this.findOneIntersection(id);
    return this.intersectionRepo.remove(intersection);
  }

  async getSignals(intersectionId: string) {
    return this.signalRepo.find({ where: { intersectionId } });
  }

  async updateSignal(signalId: string, dto: UpdateSignalDto) {
    const signal = await this.signalRepo.findOne({ where: { id: signalId } });
    if (!signal) throw new NotFoundException('Signal not found');
    Object.assign(signal, dto);
    return this.signalRepo.save(signal);
  }

  async getMetrics(params: { intersectionId?: string; from?: string; to?: string }) {
    const where: any = {};
    if (params.intersectionId) where.intersectionId = params.intersectionId;
    if (params.from && params.to) {
      where.timestamp = Between(new Date(params.from), new Date(params.to));
    }
    return this.metricRepo.find({
      where,
      order: { timestamp: 'DESC' },
      take: 100,
    });
  }

  async saveMetric(data: Partial<TrafficMetric>) {
    const metric = this.metricRepo.create(data);
    return this.metricRepo.save(metric);
  }

  async getIntersectionCount() {
    return this.intersectionRepo.count();
  }
}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeedService } from './seed.service';
import { User, Intersection, TrafficSignal, TrafficMetric, SimulationRun, DRLModel } from './entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Intersection, TrafficSignal, TrafficMetric, SimulationRun, DRLModel]),
  ],
  providers: [SeedService],
})
export class SeedModule {}

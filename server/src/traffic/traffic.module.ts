import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TrafficService } from './traffic.service';
import { TrafficController } from './traffic.controller';
import { Intersection, TrafficSignal, TrafficMetric } from '../database/entities';

@Module({
  imports: [TypeOrmModule.forFeature([Intersection, TrafficSignal, TrafficMetric])],
  controllers: [TrafficController],
  providers: [TrafficService],
  exports: [TrafficService],
})
export class TrafficModule {}

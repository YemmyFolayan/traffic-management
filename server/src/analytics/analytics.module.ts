import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnalyticsService } from './analytics.service';
import { AnalyticsController } from './analytics.controller';
import { SimulationRun } from '../database/entities';
import { TrafficModule } from '../traffic/traffic.module';
import { SimulationModule } from '../simulation/simulation.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([SimulationRun]),
    TrafficModule,
    SimulationModule,
  ],
  controllers: [AnalyticsController],
  providers: [AnalyticsService],
  exports: [AnalyticsService],
})
export class AnalyticsModule {}

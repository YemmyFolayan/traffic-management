import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SimulationEngine } from './simulation.engine';
import { SimulationService } from './simulation.service';
import { SimulationRun } from '../database/entities';

@Module({
  imports: [TypeOrmModule.forFeature([SimulationRun])],
  providers: [SimulationEngine, SimulationService],
  exports: [SimulationEngine, SimulationService],
})
export class SimulationModule {}

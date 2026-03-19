import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DRLEngine } from './drl.engine';
import { DRLService } from './drl.service';
import { DRLController } from './drl.controller';
import { DRLModel } from '../database/entities';

@Module({
  imports: [TypeOrmModule.forFeature([DRLModel])],
  controllers: [DRLController],
  providers: [DRLEngine, DRLService],
  exports: [DRLService],
})
export class DRLModule {}

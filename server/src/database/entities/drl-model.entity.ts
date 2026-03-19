import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';
import { DRLModelStatus } from '../../common/enums';

@Entity('drl_models')
export class DRLModel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column('jsonb')
  config: Record<string, any>;

  @Column({ default: 0 })
  episodes: number;

  @Column('decimal', { precision: 10, scale: 4, default: 0 })
  bestReward: number;

  @Column({ type: 'enum', enum: DRLModelStatus, default: DRLModelStatus.TRAINING })
  status: DRLModelStatus;

  @Column('jsonb', { nullable: true })
  trainingHistory: Record<string, any>[];

  @CreateDateColumn()
  createdAt: Date;
}

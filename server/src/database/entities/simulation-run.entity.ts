import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';
import { SimulationStatus } from '../../common/enums';

@Entity('simulation_runs')
export class SimulationRun {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column('jsonb')
  config: Record<string, any>;

  @Column({ type: 'enum', enum: SimulationStatus, default: SimulationStatus.RUNNING })
  status: SimulationStatus;

  @CreateDateColumn()
  startedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  completedAt: Date;

  @Column('jsonb', { nullable: true })
  results: Record<string, any>;
}

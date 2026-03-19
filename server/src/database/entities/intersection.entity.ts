import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { IntersectionStatus } from '../../common/enums';
import { TrafficSignal } from './traffic-signal.entity';
import { TrafficMetric } from './traffic-metric.entity';

@Entity('intersections')
export class Intersection {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column('decimal', { precision: 10, scale: 7 })
  latitude: number;

  @Column('decimal', { precision: 10, scale: 7 })
  longitude: number;

  @Column({ default: 4 })
  laneCount: number;

  @Column({ default: 100 })
  capacity: number;

  @Column({ type: 'enum', enum: IntersectionStatus, default: IntersectionStatus.ACTIVE })
  status: IntersectionStatus;

  @Column({ nullable: true })
  createdBy: string;

  @OneToMany(() => TrafficSignal, signal => signal.intersection, { cascade: true })
  signals: TrafficSignal[];

  @OneToMany(() => TrafficMetric, metric => metric.intersection)
  metrics: TrafficMetric[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

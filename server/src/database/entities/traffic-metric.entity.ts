import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Intersection } from './intersection.entity';

@Entity('traffic_metrics')
export class TrafficMetric {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  intersectionId: string;

  @ManyToOne(() => Intersection, intersection => intersection.metrics, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'intersectionId' })
  intersection: Intersection;

  @CreateDateColumn()
  timestamp: Date;

  @Column('decimal', { precision: 10, scale: 2 })
  avgWaitTime: number;

  @Column('int')
  throughput: number;

  @Column('int')
  queueLength: number;

  @Column('decimal', { precision: 5, scale: 2 })
  congestionIndex: number;
}

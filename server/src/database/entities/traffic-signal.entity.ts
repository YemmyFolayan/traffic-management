import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { SignalPhase, SignalDirection } from '../../common/enums';
import { Intersection } from './intersection.entity';

@Entity('traffic_signals')
export class TrafficSignal {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  intersectionId: string;

  @ManyToOne(() => Intersection, intersection => intersection.signals, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'intersectionId' })
  intersection: Intersection;

  @Column({ type: 'enum', enum: SignalDirection })
  direction: SignalDirection;

  @Column({ type: 'enum', enum: SignalPhase, default: SignalPhase.RED })
  currentPhase: SignalPhase;

  @Column({ default: 30 })
  greenDuration: number;

  @Column({ default: 5 })
  yellowDuration: number;

  @Column({ default: 30 })
  redDuration: number;
}

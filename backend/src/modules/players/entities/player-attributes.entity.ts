import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Player } from './player.entity';

@Entity('player_attributes')
export class PlayerAttributes {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'bigint', nullable: true })
  player_api_id: number;

  @Column({ type: 'text', nullable: true })
  date: string;

  @Column({ type: 'bigint', nullable: true })
  overall_rating: number;

  @Column({ type: 'text', nullable: true })
  preferred_foot: string;

  @Column({ type: 'text', nullable: true })
  attacking_work_rate: string;

  @Column({ type: 'text', nullable: true })
  defensive_work_rate: string;

  @Column({ type: 'bigint', nullable: true })
  gk_diving: number;

  @Column({ type: 'bigint', nullable: true })
  defending: number;

  @Column({ type: 'bigint', nullable: true })
  marking: number;

  @Column({ type: 'bigint', nullable: true })
  standing_tackle: number;

  @Column({ type: 'bigint', nullable: true })
  sliding_tackle: number;

  @Column({ type: 'bigint', nullable: true })
  short_passing: number;

  @Column({ type: 'bigint', nullable: true })
  vision: number;

  @ManyToOne(() => Player)
  @JoinColumn({ name: 'player_api_id', referencedColumnName: 'player_api_id' })
  player: Player;
}
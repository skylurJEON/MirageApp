import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { PlayerAttributes } from './player-attributes.entity';

@Entity('player')
export class Player {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'bigint', nullable: true })
  player_api_id: number;

  @Column({ type: 'text', nullable: true })
  player_name: string;

  @Column({ type: 'bigint', nullable: true })
  player_fifa_api_id: number;

  @Column({ type: 'text', nullable: true })
  birthday: string;

  @Column({ type: 'bigint', nullable: true })
  height: number;

  @Column({ type: 'bigint', nullable: true })
  weight: number;

  @OneToMany(() => PlayerAttributes, attributes => attributes.player)
  attributes: PlayerAttributes[];
}
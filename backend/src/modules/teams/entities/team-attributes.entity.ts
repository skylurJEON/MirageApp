import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Team } from './team.entity';

@Entity('team_attributes')
export class TeamAttributes {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'bigint', nullable: true })
  team_fifa_api_id: number;

  @Column({ type: 'bigint', nullable: true })
  team_api_id: number;

  @Column({ type: 'text', nullable: true })
  date: string;

  @Column({ type: 'bigint', nullable: true })
  buildupplayspeed: number;

  @Column({ type: 'text', nullable: true })
  buildupplayspeedclass: string;

  // ... 기타 속성들

  @ManyToOne(() => Team, team => team.attributes)
  team: Team;
}
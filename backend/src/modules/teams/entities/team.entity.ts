import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { TeamAttributes } from './team-attributes.entity';
import { Match } from '../../matches/entities/match.entity';

@Entity('team')
export class Team {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'bigint', nullable: true })
  team_api_id: number;

  @Column({ type: 'bigint', nullable: true })
  team_fifa_api_id: number;

  @Column({ type: 'text', nullable: true })
  team_long_name: string;

  @Column({ type: 'text', nullable: true })
  team_short_name: string;

  @OneToMany(() => TeamAttributes, attributes => attributes.team)
  attributes: TeamAttributes[];

  @OneToMany(() => Match, match => match.homeTeam)
  homeMatches: Match[];

  @OneToMany(() => Match, match => match.awayTeam)
  awayMatches: Match[];
}
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { League } from '../../leagues/entities/league.entity';
import { Match } from '../../matches/entities/match.entity';

@Entity('country')
export class Country {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'text', nullable: true })
  name: string;

  @OneToMany(() => League, league => league.country)
  leagues: League[];

  @OneToMany(() => Match, match => match.country)
  matches: Match[];
}
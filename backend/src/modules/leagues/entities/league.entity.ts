import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Country } from '../../countries/entities/country.entity';
import { Match } from '../../matches/entities/match.entity';

@Entity('league')
export class League {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'bigint', nullable: true })
  country_id: number;

  @Column({ type: 'text', nullable: true })
  name: string;

  @ManyToOne(() => Country, country => country.leagues)
  @JoinColumn({ name: 'country_id' })
  country: Country;

  @OneToMany(() => Match, match => match.league)
  matches: Match[];
}
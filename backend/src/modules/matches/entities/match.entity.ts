import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Country } from '../../countries/entities/country.entity';
import { League } from '../../leagues/entities/league.entity';
import { Team } from '../../teams/entities/team.entity';

@Entity('match')
export class Match {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'bigint', nullable: true })
  country_id: number;

  @Column({ type: 'bigint', nullable: true })
  league_id: number;

  @Column({ type: 'text', nullable: true })
  season: string;

  @Column({ type: 'bigint', nullable: true })
  stage: number;

  @Column({ type: 'text', nullable: true })
  date: string;

  @Column({ type: 'bigint', nullable: true })
  match_api_id: number;

  @Column({ type: 'bigint', nullable: true })
  home_team_api_id: number;

  @Column({ type: 'bigint', nullable: true })
  away_team_api_id: number;

  @Column({ type: 'bigint', nullable: true })
  home_team_goal: number;

  @Column({ type: 'bigint', nullable: true })
  away_team_goal: number;

  // 경기 통계 데이터
  @Column({ type: 'text', nullable: true })
  goal: string;

  @Column({ type: 'text', nullable: true })
  shoton: string;

  @Column({ type: 'text', nullable: true })
  shotoff: string;

  @Column({ type: 'text', nullable: true })
  foulcommit: string;

  @Column({ type: 'text', nullable: true })
  card: string;

  @Column({ type: 'text', nullable: true })
  cross: string;

  @Column({ type: 'text', nullable: true })
  corner: string;

  @Column({ type: 'text', nullable: true })
  possession: string;

  // B365 배당률
  @Column({ type: 'numeric', nullable: true })
  b365h: number;

  @Column({ type: 'numeric', nullable: true })
  b365d: number;

  @Column({ type: 'numeric', nullable: true })
  b365a: number;

  // BW 배당률
  @Column({ type: 'numeric', nullable: true })
  bwh: number;

  @Column({ type: 'numeric', nullable: true })
  bwd: number;

  @Column({ type: 'numeric', nullable: true })
  bwa: number;

  // IW 배당률
  @Column({ type: 'numeric', nullable: true })
  iwh: number;

  @Column({ type: 'numeric', nullable: true })
  iwd: number;

  @Column({ type: 'numeric', nullable: true })
  iwa: number;

  // LB 배당률
  @Column({ type: 'numeric', nullable: true })
  lbh: number;

  @Column({ type: 'numeric', nullable: true })
  lbd: number;

  @Column({ type: 'numeric', nullable: true })
  lba: number;

  // PS 배당률
  @Column({ type: 'numeric', nullable: true })
  psh: number;

  @Column({ type: 'numeric', nullable: true })
  psd: number;

  @Column({ type: 'numeric', nullable: true })
  psa: number;

  // WH 배당률
  @Column({ type: 'numeric', nullable: true })
  whh: number;

  @Column({ type: 'numeric', nullable: true })
  whd: number;

  @Column({ type: 'numeric', nullable: true })
  wha: number;

  // SJ 배당률
  @Column({ type: 'numeric', nullable: true })
  sjh: number;

  @Column({ type: 'numeric', nullable: true })
  sjd: number;

  @Column({ type: 'numeric', nullable: true })
  sja: number;

  // VC 배당률
  @Column({ type: 'numeric', nullable: true })
  vch: number;

  @Column({ type: 'numeric', nullable: true })
  vcd: number;

  @Column({ type: 'numeric', nullable: true })
  vca: number;

  // GB 배당률
  @Column({ type: 'numeric', nullable: true })
  gbh: number;

  @Column({ type: 'numeric', nullable: true })
  gbd: number;

  @Column({ type: 'numeric', nullable: true })
  gba: number;

  // BS 배당률
  @Column({ type: 'numeric', nullable: true })
  bsh: number;

  @Column({ type: 'numeric', nullable: true })
  bsd: number;

  @Column({ type: 'numeric', nullable: true })
  bsa: number;

  @ManyToOne(() => Country, country => country.matches)
  @JoinColumn({ name: 'country_id' })
  country: Country;

  @ManyToOne(() => League, league => league.matches)
  @JoinColumn({ name: 'league_id' })
  league: League;

  @ManyToOne(() => Team, team => team.homeMatches)
  @JoinColumn({ name: 'home_team_api_id', referencedColumnName: 'team_api_id' })
  homeTeam: Team;

  @ManyToOne(() => Team, team => team.awayMatches)
  @JoinColumn({ name: 'away_team_api_id', referencedColumnName: 'team_api_id' })
  awayTeam: Team;

  @Column()
  home_player_1: number;
  @Column()
  home_player_2: number;
  @Column()
  home_player_3: number;
  @Column()
  home_player_4: number;
  @Column()
  home_player_5: number;
  @Column()
  home_player_6: number;
  @Column()
  home_player_7: number;
  @Column()
  home_player_8: number;
  @Column()
  home_player_9: number;
  @Column()
  home_player_10: number;
  @Column()
  home_player_11: number;

  @Column()
  away_player_1: number;
  @Column()
  away_player_2: number;
  @Column()
  away_player_3: number;
  @Column()
  away_player_4: number;
  @Column()
  away_player_5: number;
  @Column()
  away_player_6: number;
  @Column()
  away_player_7: number;
  @Column()
  away_player_8: number;
  @Column()
  away_player_9: number;
  @Column()
  away_player_10: number;
  @Column()
  away_player_11: number;
}
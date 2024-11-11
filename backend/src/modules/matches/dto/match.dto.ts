import { IsOptional, IsNumber, IsString, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class MatchDto {
  id: number;
  country_id: number;
  league_id: number;
  season: string;
  stage: number;
  date: string;
  match_api_id: number;
  home_team_api_id: number;
  away_team_api_id: number;
  home_team_goal: number;
  away_team_goal: number;
  home_player_1: number;
  // ... 다른 선수 필드들
  goal: string;
  shoton: string;
  shotoff: string;
  foulcommit: string;
  card: string;
  cross: string;
  corner: string;
  possession: string;
}

// 검색을 위한 DTO
export class MatchFilterDto {
  @IsOptional()
  @IsString()
  season?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  league_id?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  team_api_id?: number;

  @IsOptional()
  @IsString()
  date_from?: string;

  @IsOptional()
  @IsString()
  date_to?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(1)
  page: number = 1;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(1)
  limit: number = 100;
}
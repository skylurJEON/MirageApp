import { Controller, Get, Param, Query } from '@nestjs/common';
import { MatchesService } from './matches.service';
import { Match } from './entities/match.entity';
import { MatchFilterDto } from './dto/match.dto';

@Controller('matches')
export class MatchesController {
  constructor(private readonly matchesService: MatchesService) {}

  @Get()
  async findAll(@Query() filterDto: MatchFilterDto): Promise<{ data: Match[], meta: any }> {
    return await this.matchesService.findAll(filterDto);
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Match> {
    return await this.matchesService.findOne(id);
  }

  @Get('league/:leagueId')
  async findByLeague(@Param('leagueId') leagueId: number): Promise<Match[]> {
    return await this.matchesService.findByLeague(leagueId);
  }

  @Get('team/:teamId')
  async findByTeam(@Param('teamId') teamId: number): Promise<Match[]> {
    return await this.matchesService.findByTeam(teamId);
  }

  @Get('season/:season')
  async findBySeason(@Param('season') season: string): Promise<Match[]> {
    return await this.matchesService.findBySeason(season);
  }

  @Get(':id/statistics')
  async getMatchStatistics(@Param('id') id: number) {
    return await this.matchesService.getMatchStatistics(id);
  }

  @Get(':id/players')
  getMatchPlayers(@Param('id') id: string) {
    return this.matchesService.getMatchPlayers(+id);
  }
}
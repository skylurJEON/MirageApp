import { Controller, Get, Param, Query } from '@nestjs/common';
import { LeaguesService } from './leagues.service';
import { League } from './entities/league.entity';

@Controller('leagues')
export class LeaguesController {
  constructor(private readonly leaguesService: LeaguesService) {}

  @Get()
  async findAll(): Promise<League[]> {
    return await this.leaguesService.findAll();
  }

  @Get('country/:countryId')
  async findByCountry(@Param('countryId') countryId: number): Promise<League[]> {
    return await this.leaguesService.findByCountry(countryId);
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<League> {
    return await this.leaguesService.findOne(id);
  }
}
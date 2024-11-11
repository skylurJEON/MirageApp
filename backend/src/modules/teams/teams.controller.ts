import { Controller, Get, Param, Query } from '@nestjs/common';
import { TeamsService } from './teams.service';
import { Team } from './entities/team.entity';

@Controller('teams')
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @Get()
  async findAll(): Promise<Team[]> {
    return await this.teamsService.findAll();
  }

  @Get('search')
  async findByName(@Query('name') name: string): Promise<Team[]> {
    return await this.teamsService.findByName(name);
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Team> {
    return await this.teamsService.findOne(id);
  }
}
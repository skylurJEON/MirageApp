import { Controller, Get, Param, Query } from '@nestjs/common';
import { PlayersService } from './players.service';
import { Player } from './entities/player.entity';

@Controller('players')
export class PlayersController {
  constructor(private readonly playersService: PlayersService) {}

  @Get()
  async findAll(): Promise<Player[]> {
    return await this.playersService.findAll();
  }

  @Get('search')
  async findByName(@Query('name') name: string): Promise<Player[]> {
    return await this.playersService.findByName(name);
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Player> {
    return await this.playersService.findOne(id);
  }

  @Get(':id/attributes')
  async findPlayerAttributes(@Param('id') id: number) {
    return await this.playersService.findPlayerAttributes(id);
  }
}
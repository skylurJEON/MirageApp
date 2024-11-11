import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Player } from './entities/player.entity';
import { PlayerAttributes } from './entities/player-attributes.entity';

@Injectable()
export class PlayersService {
  constructor(
    @InjectRepository(Player)
    private playerRepository: Repository<Player>,
    @InjectRepository(PlayerAttributes)
    private playerAttributesRepository: Repository<PlayerAttributes>,
  ) {}

  async findAll(): Promise<Player[]> {
    return await this.playerRepository.find();
  }

  async findOne(id: number): Promise<Player> {
    return await this.playerRepository.findOne({
      where: { id },
      relations: ['attributes'],
    });
  }

  async findByName(name: string): Promise<Player[]> {
    return await this.playerRepository
      .createQueryBuilder('player')
      .where('player.player_name ILIKE :name', { name: `%${name}%` })
      .getMany();
  }

  async findPlayerAttributes(id: number) {
    return await this.playerAttributesRepository.find({
      where: { player_api_id: id },
      order: { date: 'DESC' },
    });
  }
}
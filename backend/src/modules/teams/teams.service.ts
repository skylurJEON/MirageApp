import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Team } from './entities/team.entity';

@Injectable()
export class TeamsService {
  constructor(
    @InjectRepository(Team)
    private teamRepository: Repository<Team>,
  ) {}

  async findAll(): Promise<Team[]> {
    return await this.teamRepository.find();
  }

  async findOne(id: number): Promise<Team> {
    return await this.teamRepository.findOne({
      where: { id },
      relations: ['attributes', 'homeMatches', 'awayMatches'],
    });
  }

  async findByName(name: string): Promise<Team[]> {
    return await this.teamRepository
      .createQueryBuilder('team')
      .where('team.team_long_name ILIKE :name', { name: `%${name}%` })
      .getMany();
  }
}
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { League } from './entities/league.entity';

@Injectable()
export class LeaguesService {
  constructor(
    @InjectRepository(League)
    private leagueRepository: Repository<League>,
  ) {}

  async findAll(): Promise<League[]> {
    //return await this.leagueRepository.find();
    console.time('leagues-query');
    
    // 필요한 필드만 선택하여 간단하게 조회
    const leagues = await this.leagueRepository
      .createQueryBuilder('league')
      .select(['league.id', 'league.name'])
      .orderBy('league.name', 'ASC')
      .cache(true) // 캐싱 추가
      .getMany();
    
    console.timeEnd('leagues-query');
    console.log(`Found ${leagues.length} leagues`);
    
    return leagues;
  }
  //

  async findOne(id: number): Promise<League> {
    return await this.leagueRepository.findOne({
      where: { id },
      relations: ['country', 'matches'],
    });
  }

  async findByCountry(countryId: number): Promise<League[]> {
    return await this.leagueRepository.find({
      where: { country_id: countryId },
    });
  }
}
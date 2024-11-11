import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Match } from './entities/match.entity';
import { MatchFilterDto } from './dto/match.dto';
import { Player } from '../players/entities/player.entity';

@Injectable()
export class MatchesService {
  constructor(
    @InjectRepository(Match)
    private matchRepository: Repository<Match>,
    @InjectRepository(Player)
    private playerRepository: Repository<Player>,
  ) {}

  async findAll(filterDto: MatchFilterDto): Promise<{ data: Match[], meta: any }> {
    const page = filterDto.page || 1;
    const limit = filterDto.limit || 20;
    const skip = (page - 1) * limit;

    const query = this.matchRepository.createQueryBuilder('match')
      .leftJoinAndSelect('match.homeTeam', 'homeTeam')
      .leftJoinAndSelect('match.awayTeam', 'awayTeam')
      .leftJoinAndSelect('match.league', 'league')
      .leftJoinAndSelect('match.country', 'country')
      .orderBy('match.date', 'DESC')
      .skip(skip)
      .take(limit);

    if (filterDto.season) {
      query.andWhere('match.season = :season', { season: filterDto.season });
    }

    if (filterDto.league_id) {
      query.andWhere('match.league_id = :leagueId', { leagueId: filterDto.league_id });
    }

    if (filterDto.team_api_id) {
      query.andWhere(
        '(match.home_team_api_id = :teamId OR match.away_team_api_id = :teamId)',
        { teamId: filterDto.team_api_id },
      );
    }

    if (filterDto.date_from) {
      query.andWhere('match.date >= :dateFrom', { dateFrom: filterDto.date_from });
    }

    if (filterDto.date_to) {
      query.andWhere('match.date <= :dateTo', { dateTo: filterDto.date_to });
    }

    const [matches, total] = await query.getManyAndCount();

    return {
      data: matches,
      meta: {
        total,
        page,
        limit,
        last_page: Math.ceil(total / limit)
      }
    };
  }

  async findOne(id: number): Promise<Match> {
    return await this.matchRepository.findOne({
      where: { id },
      relations: ['homeTeam', 'awayTeam', 'league', 'country'],
    });
  }

  async findByLeague(leagueId: number): Promise<Match[]> {
    return await this.matchRepository.find({
      where: { league_id: leagueId },
      relations: ['homeTeam', 'awayTeam'],
      order: { date: 'DESC' },
    });
  }

  async findByTeam(teamId: number): Promise<Match[]> {
    return await this.matchRepository
      .createQueryBuilder('match')
      .where('match.home_team_api_id = :teamId OR match.away_team_api_id = :teamId', { teamId })
      .leftJoinAndSelect('match.homeTeam', 'homeTeam')
      .leftJoinAndSelect('match.awayTeam', 'awayTeam')
      .leftJoinAndSelect('match.league', 'league')
      .orderBy('match.date', 'DESC')
      .getMany();
  }

  async findBySeason(season: string): Promise<Match[]> {
    return await this.matchRepository.find({
      where: { season },
      relations: ['homeTeam', 'awayTeam', 'league'],
      order: { date: 'DESC' },
    });
  }

  async getMatchStatistics(matchId: number) {
    const match = await this.findOne(matchId);
    
    const parseJsonSafely = (jsonString: string | null) => {
      if (!jsonString) return null;
      try {
        return JSON.parse(jsonString);
      } catch (e) {
        console.error(`Failed to parse JSON: ${jsonString}`);
        return null;
      }
    };

    return {
      match_info: {
        date: match.date,
        season: match.season,
        home_team: match.homeTeam?.team_long_name,
        away_team: match.awayTeam?.team_long_name,
        score: {
          home: match.home_team_goal,
          away: match.away_team_goal,
        }
      },
      statistics: {
        goals: parseJsonSafely(match.goal),
        shots: {
          on: parseJsonSafely(match.shoton),
          off: parseJsonSafely(match.shotoff),
        },
        fouls: parseJsonSafely(match.foulcommit),
        cards: parseJsonSafely(match.card),
        crosses: parseJsonSafely(match.cross),
        corners: parseJsonSafely(match.corner),
        possession: parseJsonSafely(match.possession),
      },
      odds: {
        b365: {
          home: match.b365h,
          draw: match.b365d,
          away: match.b365a,
        },
        bw: {
          home: match.bwh,
          draw: match.bwd,
          away: match.bwa,
        },
        iw: {
          home: match.iwh,
          draw: match.iwd,
          away: match.iwa,
        },
        lb: {
          home: match.lbh,
          draw: match.lbd,
          away: match.lba,
        },
        ps: {
          home: match.psh,
          draw: match.psd,
          away: match.psa,
        },
        wh: {
          home: match.whh,
          draw: match.whd,
          away: match.wha,
        },
        sj: {
          home: match.sjh,
          draw: match.sjd,
          away: match.sja,
        },
        vc: {
          home: match.vch,
          draw: match.vcd,
          away: match.vca,
        },
        gb: {
          home: match.gbh,
          draw: match.gbd,
          away: match.gba,
        },
        bs: {
          home: match.bsh,
          draw: match.bsd,
          away: match.bsa,
        }
      }
    };
  }

  async getMatchPlayers(matchId: number): Promise<any> {
    const match = await this.matchRepository.findOne({
      where: { id: matchId },
      relations: ['homeTeam', 'awayTeam'],
    });

    if (!match) {
      throw new NotFoundException('Match not found');
    }

    // 홈팀 선수 ID 배열
    const homePlayerIds = [
      match.home_player_1,
      match.home_player_2,
      match.home_player_3,
      match.home_player_4,
      match.home_player_5,
      match.home_player_6,
      match.home_player_7,
      match.home_player_8,
      match.home_player_9,
      match.home_player_10,
      match.home_player_11,
    ].filter(id => id != null);

    // 어웨이팀 선수 ID 배열
    const awayPlayerIds = [
      match.away_player_1,
      match.away_player_2,
      match.away_player_3,
      match.away_player_4,
      match.away_player_5,
      match.away_player_6,
      match.away_player_7,
      match.away_player_8,
      match.away_player_9,
      match.away_player_10,
      match.away_player_11,
    ].filter(id => id != null);

    console.log('Home player IDs:', homePlayerIds);
    console.log('Away player IDs:', awayPlayerIds);

    // player_api_id로 선수 정보 조회
    const homePlayers = await this.playerRepository
      .createQueryBuilder('player')
      .where('player.player_api_id IN (:...ids)', { ids: homePlayerIds })
      .getMany();

    const awayPlayers = await this.playerRepository
      .createQueryBuilder('player')
      .where('player.player_api_id IN (:...ids)', { ids: awayPlayerIds })
      .getMany();

    console.log('Home players found:', homePlayers);
    console.log('Away players found:', awayPlayers);

    return {
      homeTeam: {
        team_api_id: match.home_team_api_id,
        team_name: match.homeTeam?.team_long_name,
        players: homePlayers.map((player, index) => ({
          id: player.id.toString(),
          name: player.player_name,
          birthday: player.birthday,
          height: player.height,
          weight: player.weight,
          position: determinePosition(index),
          number: (index + 1).toString().padStart(2, '0')
        }))
      },
      awayTeam: {
        team_api_id: match.away_team_api_id,
        team_name: match.awayTeam?.team_long_name,
        players: awayPlayers.map((player, index) => ({
          id: player.id.toString(),
          name: player.player_name,
          birthday: player.birthday,
          height: player.height,
          weight: player.weight,
          position: determinePosition(index),
          number: (index + 1).toString().padStart(2, '0')
        }))
      }
    };
  }
}

// 포지션 결정 함수
const determinePosition = (index: number): string => {
  if (index === 0) return 'GK';
  if (index <= 4) return 'DF';
  if (index <= 8) return 'MF';
  return 'FW';
};
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Country } from './entities/country.entity';

@Injectable()
export class CountriesService {
  constructor(
    @InjectRepository(Country)
    private countryRepository: Repository<Country>,
  ) {}

  async findAll(): Promise<Country[]> {
    return await this.countryRepository.find();
  }

  async findOne(id: number): Promise<Country> {
    return await this.countryRepository.findOne({
      where: { id },
      relations: ['leagues', 'matches'],
    });
  }
}
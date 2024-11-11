import { Controller, Get, Param } from '@nestjs/common';
import { CountriesService } from './countries.service';
import { Country } from './entities/country.entity';

@Controller('countries')
export class CountriesController {
  constructor(private readonly countriesService: CountriesService) {}

  @Get()
  async findAll(): Promise<Country[]> {
    return await this.countriesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Country> {
    return await this.countriesService.findOne(id);
  }
}
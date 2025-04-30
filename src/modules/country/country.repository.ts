import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Country } from 'src/entities/Country.entity';
import { Repository } from 'typeorm';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class CountryRepository {
  constructor(
    @InjectRepository(Country)
    private readonly countryRepository: Repository<Country>,
  ) {}

  async getCountries() {
    return await this.countryRepository.find();
  }

  async findCountry(country: string) {
    return await this.countryRepository.findOneBy({
      name: country,
    });
  }
}

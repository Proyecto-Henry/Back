import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { countries } from './countries.mock';
import { Country } from 'src/entities/Country.entity';

@Injectable()
export class CountriesSeed {
  constructor(
    @InjectRepository(Country)
    private readonly countriesRepository: Repository<Country>,
  ) {}

  async seed() {
    const countryNames = countries.map((c) => c.name);

    // Obtener todos los countries existentes de una vez
    const existingCountries = await this.countriesRepository.find({
      where: { name: In(countryNames) },
    });

    for (const countryData of countries) {
      const exists = existingCountries.some((c) => c.name === countryData.name);
      if (!exists) {
        const newCountry = this.countriesRepository.create({
          name: countryData.name,
          phone_code: countryData.phone_code,
        });
        await this.countriesRepository.save(newCountry);
      }
    }
  }
}

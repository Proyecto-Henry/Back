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

  async loadCountry() {
    const filePath = path.join(__dirname, '../../..', 'src', 'countries.json');
    console.log(filePath);

    // Leer el archivo y parsear su contenido
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const countries = JSON.parse(fileContent);
    console.log(countries);

    for (const country of countries) {
      const existsCountry = await this.countryRepository.findOne({
        where: { name: country.name },
      });

      if (!existsCountry) {
        const newCountry = this.countryRepository.create({
          name: country.name,
          phone_code: country.phone_code,
        });
        await this.countryRepository.save(newCountry);
      }
    }
    return 'Paises agregados';
  }
}

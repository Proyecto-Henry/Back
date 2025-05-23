import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Country } from 'src/entities/Country.entity';
import { Repository } from 'typeorm';

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

  async findByCode(countryCode) {
    return await this.countryRepository.findOne({
      where: { phone_code: countryCode }
    })
  }

  async findCountryById(country_id: number) {
    return await this.countryRepository.findOneBy({id: country_id})
  }
}

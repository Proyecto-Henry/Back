import { Injectable } from '@nestjs/common';
import { CountryRepository } from './country.repository';

@Injectable()
export class CountryService {
  
  constructor(private readonly countryRepository: CountryRepository) {}

  getCountries() {
    return this.countryRepository.getCountries();
  }
  findCountry(country: string) {
    return this.countryRepository.findCountry(country);
  }

  findByCode(countryCode) {
    return this.countryRepository.findByCode(countryCode);
  }

  findCountryById(country_id: number) {
    return this.countryRepository.findCountryById(country_id)
  }
}

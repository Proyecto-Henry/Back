import { Controller, Post } from '@nestjs/common';
import { CountryService } from './country.service';

@Controller('country')
export class CountryController {
  constructor(private readonly countryService: CountryService) {}

  @Post('seeder')
  loadCountries() {
    return this.countryService.loadCountries();
  }
}

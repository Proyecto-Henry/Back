import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Country } from 'src/entities/Country.entity';
import { CountryController } from './country.controller';
import { CountryService } from './country.service';
import { CountryRepository } from './country.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Country])],
  providers: [CountryService, CountryRepository],
  controllers: [CountryController],
})
export class CountryModule {}

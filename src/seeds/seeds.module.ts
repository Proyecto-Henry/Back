import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Country } from 'src/entities/Country.entity';
import { CountriesSeed } from './countries/countries.seed';

@Module({
  imports: [TypeOrmModule.forFeature([Country])],
  providers: [CountriesSeed],
  exports: [CountriesSeed],
})
export class SeedsModule {}

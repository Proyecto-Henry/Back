import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Store } from 'src/entities/Store.entity';
import { StoresController } from './stores.controller';
import { StoresService } from './stores.service';
import { StoresRepository } from './stores.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Store])],
  providers: [StoresService, StoresRepository],
  controllers: [StoresController],
  exports: [StoresService],
})
export class StoreModule {}

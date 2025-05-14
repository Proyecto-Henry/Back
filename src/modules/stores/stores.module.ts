import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Store } from 'src/entities/Store.entity';
import { StoresController } from './stores.controller';
import { StoresService } from './stores.service';
import { StoresRepository } from './stores.repository';
import { UserModule } from '../users/users.module';
import { SaleModule } from '../sales/sales.module';

@Module({
  imports: [TypeOrmModule.forFeature([Store]), UserModule],
  providers: [StoresService, StoresRepository],
  controllers: [StoresController],
  exports: [StoresService, StoresRepository],
})
export class StoreModule {}

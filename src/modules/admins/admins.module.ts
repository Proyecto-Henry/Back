import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Admin } from 'src/entities/Admin.entity';
import { Country } from 'src/entities/Country.entity';
import { AdminsService } from './admins.service';
import { AdminsRepository } from './admins.repository';
import { AdminsController } from './admins.controller';
import { StripeService } from 'src/common/stripe.service';

@Module({
  imports: [TypeOrmModule.forFeature([Admin, Country])],
  providers: [AdminsService, AdminsRepository],
  controllers: [AdminsController],
  exports: [AdminsService],
})
export class AdminModule {}

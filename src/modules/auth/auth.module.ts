import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/User.entity';
import { UsersService } from '../users/users.service';
import { UsersRepository } from '../users/users.repository';
import { AuthController } from './auth.controller';
import { Country } from 'src/entities/Country.entity';
import { Admin } from 'src/entities/Admin.entity';
import { AdminsService } from '../admins/admins.service';
import { AdminsRepository } from '../admins/admins.repository';
import { AuthService } from './auth.service';
import { SubscriptionsService } from '../subscriptions/subscriptions.service';
import { Subscription } from 'src/entities/Subscription.entity';
import { SubscriptionsRepository } from '../subscriptions/subscriptions.repository';
import { CountryService } from '../country/country.service';
import { CountryRepository } from '../country/country.repository';
import { MailService } from 'src/common/nodemailer.service';

@Module({
  imports: [TypeOrmModule.forFeature([Admin, User, Country, Subscription])],
  providers: [
    AdminsService,
    AdminsRepository,
    UsersService,
    UsersRepository,
    AuthService,
    CountryService,
    CountryRepository,
    SubscriptionsService,
    SubscriptionsRepository,
    MailService,
  ],
  controllers: [AuthController],
  exports: [],
})
export class AuthModule {}

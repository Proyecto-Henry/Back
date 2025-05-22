import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Admin } from 'src/entities/Admin.entity';
import { Country } from 'src/entities/Country.entity';
import { AdminsService } from './admins.service';
import { AdminsRepository } from './admins.repository';
import { AdminsController } from './admins.controller';
import { StripeService } from 'src/common/stripe.service';
import { Store } from 'src/entities/Store.entity';
import { UserModule } from '../users/users.module';
import { AuthModule } from '../auth/auth.module';
import { Subscription } from 'src/entities/Subscription.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Admin, Country, Store, Subscription]), UserModule],
  providers: [AdminsService, AdminsRepository, StripeService],
  controllers: [AdminsController],
  exports: [AdminsService],
})
export class AdminModule {}

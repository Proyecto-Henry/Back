import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import typeOrmConfig from './config/database.config';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { ProductModule } from './modules/products/products.module';
import { SaleModule } from './modules/sales/sales.module';
import { SubscriptionModule } from './modules/subscriptions/subscriptions.module';
import { StoreModule } from './modules/stores/stores.module';
import { AdminModule } from './modules/admins/admins.module';
import { CountryModule } from './modules/country/country.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [typeOrmConfig],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const typeOrmConfig = configService.get('typeorm');

        console.log('📦 Configuración TypeORM cargada desde .env:');
        if (!typeOrmConfig) {
          throw new Error('No se pudo obtener la configuración de TypeORM');
        }
        return typeOrmConfig;
      },
    }),
    JwtModule.register({
      global: true,
      signOptions: { expiresIn: '18h' },
      secret: process.env.JWT_SECRET,
    }),
    AdminModule,
    UserModule,
    AuthModule,
    ProductModule,
    SaleModule,
    SubscriptionModule,
    StoreModule,
    CountryModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

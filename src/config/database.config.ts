import { DataSource, DataSourceOptions } from 'typeorm';
import { config as dotenvConfig } from 'dotenv';
import { registerAs } from '@nestjs/config';

dotenvConfig({ path: './.env.development' });

export const config = {
  type: 'postgres',
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT as unknown as number,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  synchronize: true,
  logging: false,
  // ssl: {
  //   rejectUnauthorized: false, // Importante para Render u otros entornos con SSL auto-firmado
  // },
  // extra: {
  //   ssl: true,
  // },
  entities: ['dist/**/*.entity{.js,.ts}'],
  migrations: ['dist/migrations/*{.js,.ts}'],
  dropSchema: true,
};

export default registerAs('typeorm', () => config);

export const AppDataSource = new DataSource(config as DataSourceOptions);

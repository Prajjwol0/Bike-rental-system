

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mysql',
        host: config.get<string>('DB_HOST') ?? 'localhost',
        port: +(config.get<number>('DB_PORT') ?? 3306),
        username: config.get<string>('DB_USER') ?? 'root',
        password: config.get<string>('DB_PASS') ?? '',
        database: config.get<string>('DB_NAME') ?? 'bike_rental_db',
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        synchronize: true,
      }),
    }),
  ],
  exports: [TypeOrmModule], 
})
export class DatabaseModule {}

// src/database/database.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres', 
      host: 'localhost',
      port: 5432, 
      username: 'postgres', // your PostgreSQL username
      password: 'password' , // your PostgreSQL password
      database: 'bike_rental_db',
      autoLoadEntities: true,
      synchronize: false, // for development only
    }),
  ],
})
export class DatabaseModule {}


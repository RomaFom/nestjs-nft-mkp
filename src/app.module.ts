import { Module } from '@nestjs/common';

import { SequelizeModule } from '@nestjs/sequelize';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { User } from './users/users.model';
import { AuthModule } from './auth/auth.module';
import { TransactionsModule } from './transactions/transactions.module';
import { Transaction } from './transactions/transactions.model';
import { Web3Module as NestWeb3Module } from 'nest-web3';
import { Web3Module } from './web3/web3.module';
@Module({
  controllers: [],
  providers: [],
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.PG_HOST,
      port: +process.env.PG_PORT,
      username: process.env.PG_USER,
      password: process.env.PG_PASSWORD,
      database: process.env.PG_DATABASE,
      models: [User, Transaction],
      autoLoadModels: true,
    }),
    NestWeb3Module.forRoot({
      name: 'eth',
      url: process.env.ETHERS_HOST,
    }),
    UsersModule,
    AuthModule,
    TransactionsModule,
    Web3Module,
  ],
})
export class AppModule {}

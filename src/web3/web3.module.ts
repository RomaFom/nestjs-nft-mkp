import { Module } from '@nestjs/common';
import { Web3Service } from './web3.service';
import { Web3Controller } from './web3.controller';

@Module({
  providers: [Web3Service],
  controllers: [Web3Controller],
  exports: [Web3Service],
})
export class Web3Module {}

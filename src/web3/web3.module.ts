import { forwardRef, Module } from '@nestjs/common';
import { Web3Service } from './web3.service';
import { Web3Controller } from './web3.controller';
import { NftsModule } from '../nfts/nfts.module';
import { ItemsModule } from '../items/items.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { Nft } from '../nfts/nfts.model';
import { Item } from '../items/items.model';
import { TaskModule } from '../task/task.module';

@Module({
  providers: [Web3Service],
  controllers: [Web3Controller],
  imports: [
    NftsModule,
    ItemsModule,
    forwardRef(() => TaskModule),
    SequelizeModule.forFeature([Nft, Item]),
  ],
  exports: [Web3Service],
})
export class Web3Module {}

import { Module } from '@nestjs/common';
import { NftsService } from './nfts.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Nft } from './nfts.model';

@Module({
  providers: [NftsService],
  imports: [SequelizeModule.forFeature([Nft])],
  exports: [NftsService],
})
export class NftsModule {}

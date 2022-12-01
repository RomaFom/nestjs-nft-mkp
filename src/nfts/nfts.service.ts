import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Nft, NftCreationAttrs } from './nfts.model';
import { NftMetadataDto } from '../web3/dto/nft-metadata.dto';

@Injectable()
export class NftsService {
  constructor(@InjectModel(Nft) private nftRepository: typeof Nft) {}

  async createNft(nft: NftCreationAttrs) {
    return await this.nftRepository.create(nft);
  }

  async updateNft(nft: NftCreationAttrs) {
    return await this.nftRepository.update(nft, {
      where: { nft_id: nft.nft_id },
    });
  }

  async getNftById(token_id: number) {
    return await this.nftRepository.findOne({ where: { nft_id: token_id } });
  }

  createNftDto(
    nft: NftMetadataDto,
    nft_id: number,
    owner: string,
  ): NftCreationAttrs {
    return {
      nft_id,
      owner,
      ...nft,
    };
    // return await this.nftRepository.create(nft);
  }
}

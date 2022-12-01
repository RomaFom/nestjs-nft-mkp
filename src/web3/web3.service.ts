import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Web3Service as NestWeb3Service } from 'nest-web3';
import * as MkpAddress from '../contracts/Marketplace-address.json';
import * as MkpAbi from '../contracts/Marketplace.json';
import * as NFTAddress from '../contracts/NFT-address.json';
import * as NFTAbi from '../contracts/NFT.json';
import { AbiItem } from 'web3-utils';
import { NftsService } from '../nfts/nfts.service';
import { ScItemDto } from './dto/sc-item.dto';
import { NftMetadataDto } from './dto/nft-metadata.dto';
import { ItemsService } from '../items/items.service';

@Injectable()
export class Web3Service {
  mkp: any;
  nft: any;
  constructor(
    private readonly web3Service: NestWeb3Service,
    private readonly nftService: NftsService,
    private readonly itemService: ItemsService,
  ) {
    const client = this.web3Service.getClient('eth');

    this.mkp = new client.eth.Contract(
      MkpAbi.abi as AbiItem[],
      MkpAddress.address,
    );
    this.nft = new client.eth.Contract(
      NFTAbi.abi as AbiItem[],
      NFTAddress.address,
    );
  }

  async indexItemsFromSC() {
    try {
      const count = await this.mkp.methods.itemCount().call();
      if (!count) return;
      // Get all items
      const allItems = await this.getAllItemsFromSC(Number(count));
      // Get owners
      const owners = await this.getOwners(allItems);
      // Get metadata
      const NftsMeta = await this.getNftMetadata(allItems);
      // Get final prices
      const finalPrices = await this.getFinalPrices(allItems);

      // Create NFTs and Items
      await Promise.all(
        allItems.map(async (item, index) => {
          const nftDto = this.nftService.createNftDto(
            NftsMeta[index],
            Number(item.tokenId),
            owners[index],
          );
          let isExist: any = await this.nftService.getNftById(nftDto.nft_id);
          if (!isExist) {
            await this.nftService.createNft(nftDto);
          }
          if (isExist) {
            await this.nftService.updateNft(nftDto);
          }

          const itemDto = this.itemService.createItemDto(
            item,
            finalPrices[index],
          );

          isExist = await this.itemService.getItemById(itemDto.item_id);
          if (!isExist) {
            await this.itemService.createItem(itemDto);
          }
          if (isExist) {
            await this.itemService.updateItem(itemDto);
          }
        }),
      );
      return {
        message: 'Items indexed successfully',
      };
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  private async getFinalPrices(items: ScItemDto[]): Promise<number[]> {
    const promises = [];
    items.forEach((item) => {
      const price = this.mkp.methods.getFinalPrice(item.tokenId).call();
      promises.push(price);
    });
    return await this.handlePromiseAll(promises);
  }

  private async getOwners(items: ScItemDto[]): Promise<string[]> {
    const promises = [];
    items.forEach((item) => {
      const owner = this.nft.methods.ownerOf(item.tokenId).call();
      promises.push(owner);
    });
    return await this.handlePromiseAll(promises);
  }

  private async getAllItemsFromSC(count: number): Promise<ScItemDto[]> {
    const promises = [];
    for (let i = 1; i <= count; i++) {
      const item = this.mkp.methods.items(i).call();
      promises.push(item);
    }
    return await this.handlePromiseAll(promises);
  }

  private async getNftMetadata(
    MkpItems: ScItemDto[],
  ): Promise<NftMetadataDto[]> {
    let promises = [];
    MkpItems.forEach((item) => {
      const nft = this.nft.methods.tokenURI(item.tokenId).call();
      promises.push(nft);
    });
    const NftURIs = await this.handlePromiseAll(promises);
    promises = [];
    NftURIs.forEach((item: string) => {
      const meta = fetch(item);
      promises.push(meta);
    });
    let nftMeta = await this.handlePromiseAll(promises);
    promises = [];
    nftMeta.forEach((item) => {
      promises.push(item.json());
    });
    nftMeta = await this.handlePromiseAll(promises);
    return nftMeta;
  }

  private async handlePromiseAll(promises: Array<Promise<any>>) {
    return await Promise.all(promises).then((values) => values);
  }
}

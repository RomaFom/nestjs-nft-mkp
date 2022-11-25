import { Injectable } from '@nestjs/common';
import { Web3Service as NestWeb3Service } from 'nest-web3';
import * as MkpAddress from '../contracts/Marketplace-address.json';
import * as MkpAbi from '../contracts/Marketplace.json';
import * as NFTAddress from '../contracts/NFT-address.json';
import * as NFTAbi from '../contracts/NFT.json';
import { AbiItem } from 'web3-utils';
import { MarketplaceItemDto } from './dto/marketplace-item.dto';
import { ethers } from 'ethers';

@Injectable()
export class Web3Service {
  mkp: any;
  nft: any;
  constructor(private readonly web3Service: NestWeb3Service) {
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

  async getMkpItems(page: number, size: number) {
    const items: MarketplaceItemDto[] = [];
    // Get the total number of items
    const count = await this.mkp.methods.itemCount().call();
    if (!count) return items;
    if (page === 0) page = 1;

    // 1,2,3,4,5,6,7,8,9,10

    const { start, end } = this.getPaginationLimits(page, size, count);

    // const end = +start + +size <= count ? +start + +size : count;

    const MkpItems = await this.getItemsFromSC(start, end);
    const FinalPrices = await this.getItemsPriceFromSC(start, end);
    const NFTItems = await this.getNFTs(MkpItems);

    let NftsMetaData: any[] = await this.getNftMetadata(NFTItems);
    NftsMetaData = await Promise.all(
      NftsMetaData.map((item) => item.json()),
    ).then((values) => values);

    MkpItems.forEach((item, index) => {
      // if (item.isSold) return;
      const newItem = new MarketplaceItemDto();
      newItem.itemId = item.itemId;
      newItem.tokenId = item.tokenId;
      newItem.nftAddress = item.nft;
      newItem.price = +ethers.utils.formatEther(item.price.toString());
      newItem.listingPrice = +ethers.utils.formatEther(
        item.listingPrice.toString(),
      );
      newItem.finalPrice = +ethers.utils.formatEther(
        FinalPrices[index].toString(),
      );
      newItem.seller = item.seller;
      newItem.isSold = item.isSold;
      newItem.metadata = NftsMetaData[index];
      items.push(newItem);
    });

    return items;
  }

  private getPaginationLimits = (
    page: number,
    size: number,
    count: number,
  ): { start: number; end: number } => {
    let start;
    let end;
    const pool = page * size;
    // if called page 1 and total size bigger than count
    if (pool > count && page === 1) {
      console.log('pool > count && page === 1');
      start = 1;
      end = count;
    }

    // if called page>1 and total size bigger than count
    if (pool >= count && page > 1) {
      start = page * size - (size - 1);
      end = count;
    }

    // In limits of count
    if (pool < count) {
      start = page * size - (size - 1);
      end = pool;
    }

    return { start, end };
  };

  private async getItemsFromSC(
    start: number,
    end: number,
    // totalCount: number,
  ): Promise<any> {
    const promises = [];
    for (let i = start; i <= end; i++) {
      const item = this.mkp.methods.items(i).call();
      promises.push(item);
    }
    return await this.handlePromiseAll(promises);
  }

  private async getItemsPriceFromSC(
    start: number,
    end: number,
    // totalCount: number,
  ): Promise<any> {
    const promises = [];
    for (let i = start; i <= end; i++) {
      const item = this.mkp.methods.getFinalPrice(i).call();
      promises.push(item);
    }
    return await this.handlePromiseAll(promises);
  }

  private async getNFTs(MkpItems: any[]) {
    const promises = [];
    MkpItems.forEach((item) => {
      const nft = this.nft.methods.tokenURI(item.tokenId).call();
      promises.push(nft);
    });
    return await this.handlePromiseAll(promises);
  }

  private async getNftMetadata(NFTItems: any[]) {
    const promises = [];
    NFTItems.forEach((item) => {
      const meta = fetch(item);
      promises.push(meta);
    });
    return await this.handlePromiseAll(promises);
  }

  private async handlePromiseAll(promises: Array<Promise<any>>) {
    return await Promise.all(promises).then((values) => values);
  }
}

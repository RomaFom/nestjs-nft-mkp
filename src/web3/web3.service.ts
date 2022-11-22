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

  async getMkpItems() {
    const items: MarketplaceItemDto[] = [];
    // Get the total number of items
    const count = await this.mkp.methods.itemCount().call();
    if (!count) return items;

    // Array of promises
    let promises = [];
    for (let i = 1; i <= count; i++) {
      const item = this.mkp.methods.items(i).call();
      promises.push(item);
    }

    const MkpItems = await Promise.all(promises).then((values) => {
      return values;
    });

    promises = [];

    MkpItems.forEach((item) => {
      const nft = this.nft.methods.tokenURI(item.tokenId).call();
      promises.push(nft);
    });

    const NFTItems = await Promise.all(promises).then((values) => {
      return values;
    });

    promises = [];

    NFTItems.forEach((item) => {
      const meta = fetch(item);
      promises.push(meta);
    });

    let NftsMetaData: any[] = await Promise.all(promises).then(
      (values) => values,
    );

    promises = [];

    NftsMetaData = await Promise.all(
      NftsMetaData.map((item) => item.json()),
    ).then((values) => values);

    MkpItems.forEach((item, index) => {
      const newItem = new MarketplaceItemDto();
      newItem.itemId = item.itemId;
      newItem.tokenId = item.tokenId;
      newItem.nftAddress = item.nft;
      newItem.price = +ethers.utils.formatEther(item.price.toString());
      newItem.listingPrice = +ethers.utils.formatEther(
        item.listingPrice.toString(),
      );
      newItem.seller = item.seller;
      newItem.isSold = item.isSold;
      newItem.metadata = NftsMetaData[index];
      items.push(newItem);
    });

    return items;
  }
}

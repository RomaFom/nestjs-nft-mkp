import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Item, ItemCreationAttrs } from './items.model';
import { ScItemDto } from '../web3/dto/sc-item.dto';
import { ethers } from 'ethers';
import { Nft } from '../nfts/nfts.model';

@Injectable()
export class ItemsService {
  constructor(@InjectModel(Item) private itemRepository: typeof Item) {}

  async getItemById(item_id: number) {
    return await this.itemRepository.findOne({ where: { item_id } });
  }

  async updateItem(item: ItemCreationAttrs) {
    return await this.itemRepository.update(item, {
      where: { item_id: item.item_id },
    });
  }

  async getItems() {
    return await this.itemRepository.findAll({ include: { model: Nft } });
  }

  async createItem(item: ItemCreationAttrs) {
    return await this.itemRepository.create(item);
  }

  createItemDto(item: ScItemDto, final_price: number): ItemCreationAttrs {
    return {
      item_id: Number(item.itemId),
      nft_id: Number(item.tokenId),
      price: this.formatEthPrice(item.price),
      listing_price: this.formatEthPrice(item.listingPrice),
      seller: item.seller,
      is_sold: item.isSold,
      total_price: this.formatEthPrice(final_price.toString()),
    };
  }

  private formatEthPrice(price: string): number {
    const formatted = +ethers.utils.formatEther(price);
    return Number(formatted);
  }
}

import {
  BelongsTo,
  Column,
  DataType,
  Model,
  Table,
} from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { Nft } from '../nfts/nfts.model';

export interface ItemCreationAttrs {
  item_id: number;
  nft_id: number;
  price: number;
  listing_price: number;
  seller: string;
  is_sold: boolean;
  total_price: number;
}

@Table({ tableName: 'items' })
export class Item extends Model<Item, ItemCreationAttrs> {
  @ApiProperty({ example: 1, description: 'Db ID' })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ApiProperty({ example: 30, description: 'Item ID' })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    allowNull: false,
  })
  item_id: number;

  @ApiProperty({ example: 30, description: 'Nft ID' })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    allowNull: false,
  })
  nft_id: number;

  @Column({
    type: DataType.FLOAT,
    unique: false,
    allowNull: false,
  })
  price: number;

  @Column({
    type: DataType.FLOAT,
    unique: false,
    allowNull: false,
  })
  listing_price: number;

  @Column({
    type: DataType.STRING,
    unique: false,
    allowNull: false,
  })
  seller: string;

  @Column({
    type: DataType.BOOLEAN,
    unique: false,
    allowNull: false,
    defaultValue: false,
  })
  is_sold: boolean;

  @Column({
    type: DataType.FLOAT,
    unique: false,
    allowNull: false,
  })
  total_price: number;

  @BelongsTo(() => Nft, { foreignKey: 'nft_id', targetKey: 'nft_id' })
  nft: Nft;
}

import { Column, DataType, Model, Table, HasOne } from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { Item } from '../items/items.model';

export interface NftCreationAttrs {
  nft_id: number;
  owner: string;
  image: string;
  name: string;
  description: string;
}

@Table({ tableName: 'nfts' })
export class Nft extends Model<Nft, NftCreationAttrs> {
  @ApiProperty({ example: 1, description: 'Db ID' })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ApiProperty({ example: 30, description: 'Nft ID' })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    allowNull: false,
  })
  nft_id: number;

  @ApiProperty({ example: '0x89y8guyuy34f3...', description: 'Owner Address' })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  owner: string;

  @ApiProperty({ example: 'https://infura....', description: 'Image URL' })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  image: string;

  @ApiProperty({ example: 'Cat NFT', description: 'NFT Name' })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  @ApiProperty({ example: 'Cool cat nft', description: 'NFT Description' })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  description: string;

  // @BelongsTo(() => User)
  // sender: User;

  @HasOne(() => Item, { foreignKey: 'nft_id', sourceKey: 'nft_id' })
  item: Item;
}

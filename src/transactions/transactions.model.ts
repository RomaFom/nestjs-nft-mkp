import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../users/users.model';

export interface TxCreationAttrs {
  user_id: number;
  sender: string;
  tx_hash: string;
  wallet: string;
  item_id: number;
}

@Table({ tableName: 'transactions' })
export class Transaction extends Model<Transaction, TxCreationAttrs> {
  @ApiProperty({ example: '1', description: 'Unique identifier' })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ApiProperty({ example: '1', description: 'User ID' })
  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  user_id: number;

  @BelongsTo(() => User)
  sender: User;

  @ApiProperty({ example: '0xsdfsd5334345...', description: 'Tx Hash' })
  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: false,
  })
  tx_hash: string;

  @ApiProperty({ example: '0x00000234234asd3...', description: 'Wallet' })
  @Column({
    type: DataType.STRING,
    unique: false,
    allowNull: false,
  })
  wallet: string;

  @ApiProperty({ example: 1, description: 'Item ID' })
  @Column({
    type: DataType.INTEGER,
    unique: false,
    allowNull: false,
  })
  item_id: number;

  @ApiProperty({
    example: '2022-11-29 11:08:08.864762',
    description: 'Created At',
  })
  @Column({
    type: DataType.DATE,
    unique: false,
    allowNull: false,
    defaultValue: DataType.NOW,
  })
  created_at: number;

  @ApiProperty({ example: 1, description: 'NFT ID' })
  @Column({
    type: DataType.INTEGER,
    unique: false,
    allowNull: false,
  })
  nft_id: number;
}

import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsNotEmpty } from 'class-validator';

export class ResponseTxDto {
  @ApiProperty({
    example: 1,
    description: 'Transaction ID',
  })
  readonly id: number;
}

export class NewTxDtoRequest {
  @ApiProperty({ example: '0x835793453...', description: 'Tx Hash' })
  @IsNotEmpty({ message: 'Tx Hash is required' })
  @IsString({ message: 'Must be a string' })
  readonly tx_hash: string;

  @ApiProperty({ example: '0x000001234...', description: 'Wallet' })
  @IsNotEmpty({ message: 'User ID is required' })
  @IsString({ message: 'Must be a string' })
  readonly wallet: string;

  @ApiProperty({ example: 1, description: 'Item ID' })
  @IsNotEmpty({ message: 'Item ID is required' })
  @IsNumber({}, { message: 'Must be a number' })
  readonly item_id: number;
}

export class NewTxDto extends NewTxDtoRequest {
  @ApiProperty({ example: 1, description: 'User ID' })
  @IsNumber({}, { message: 'Must be a number' })
  user_id: number;

  // @ApiProperty({ example: '0x835793453...', description: 'Tx Hash' })
  // @IsNotEmpty({ message: 'Tx Hash is required' })
  // @IsString({ message: 'Must be a string' })
  // readonly tx_hash: number;
  //
  // @ApiProperty({ example: '0x000001234...', description: 'Wallet' })
  // @IsNotEmpty({ message: 'User ID is required' })
  // @IsString({ message: 'Must be a string' })
  // readonly wallet: number;
}

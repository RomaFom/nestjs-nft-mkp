import { ApiProperty } from '@nestjs/swagger';

export class NftMetadataDto {
  @ApiProperty({
    example: 'https://image.url.com',
    description: 'Image URL',
  })
  image: string;

  @ApiProperty({ example: 'Cool nft', description: 'Nft Name' })
  name: string;

  @ApiProperty({
    example: 'Cool nft description',
    description: 'Nft Description',
  })
  description: string;
}

export class MarketplaceItemDto {
  @ApiProperty({ example: 1, description: 'Item ID' })
  itemId: number;

  @ApiProperty({ example: '0x835793453...', description: 'Nft Address' })
  nftAddress: string;

  @ApiProperty({ example: 1, description: 'Token ID' })
  tokenId: number;

  @ApiProperty({ example: 80, description: 'Price in ETH' })
  price: number;

  @ApiProperty({ example: 80, description: 'Listing Price in ETH' })
  listingPrice: number;

  @ApiProperty({ example: 81, description: 'Final Price Price in ETH' })
  finalPrice: number;

  @ApiProperty({
    example: '0x938727623...',
    description: 'Seller Address',
  })
  seller: string;

  @ApiProperty({ example: false, description: 'Is item sold' })
  isSold: boolean;

  @ApiProperty({
    example: {
      image: 'https://image.url.com',
      name: 'Cool nft',
      description: 'Cool nft description',
    },
    description: 'Nft Metadata',
  })
  metadata: NftMetadataDto;
}

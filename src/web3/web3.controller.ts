import { Controller, Get } from '@nestjs/common';
import { Web3Service } from './web3.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { MarketplaceItemDto } from './dto/marketplace-item.dto';

@ApiTags('Web3')
@Controller('web3')
export class Web3Controller {
  constructor(private web3Service: Web3Service) {}

  @Get('items')
  @ApiOperation({ summary: 'Get Marketplace items feed' })
  @ApiResponse({ status: 200, type: [MarketplaceItemDto] })
  getItems() {
    return this.web3Service.getMkpItems();
  }
}

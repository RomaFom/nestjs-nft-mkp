import { Controller, Get } from '@nestjs/common';
import { Web3Service } from './web3.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Web3')
@Controller('web3')
export class Web3Controller {
  constructor(private web3Service: Web3Service) {}

  // Only For Test
  @Get('init')
  async init() {
    return this.web3Service.indexItemsFromSC();
  }
}

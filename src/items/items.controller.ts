import { Controller, Get, Query } from '@nestjs/common';
import { ItemsService } from './items.service';

@Controller('marketplace')
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  @Get('get-all')
  async getAllItems(@Query('page') page: number, @Query('size') size: number) {
    return await this.itemsService.getItems(page, size);
  }
}

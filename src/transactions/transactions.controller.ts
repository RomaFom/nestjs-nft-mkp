import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TransactionsService } from './transactions.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import {
  NewTxDto,
  NewTxDtoRequest,
  ResponseTxDto,
} from './dto/transaction.dto';

@ApiTags('Transactions')
@Controller('transactions')
export class TransactionsController {
  constructor(private transactionsService: TransactionsService) {}

  @ApiOperation({ summary: 'Add Transaction' })
  @ApiResponse({ status: 200, type: ResponseTxDto })
  @UseGuards(JwtAuthGuard)
  @Post('/add')
  add(@Req() req, @Body() txDataRequest: NewTxDtoRequest) {
    const txData: NewTxDto = {
      ...txDataRequest,
      user_id: Number(req.user.id),
    };
    return this.transactionsService.add(txData);
  }
}

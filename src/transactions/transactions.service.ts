import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Transaction } from './transactions.model';
import { NewTxDto, ResponseTxDto } from './dto/transaction.dto';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectModel(Transaction) private txRepository: typeof Transaction,
  ) {}

  async add(txData: NewTxDto): Promise<ResponseTxDto> {
    let tx = await this.txRepository.findOne({
      where: { tx_hash: txData.tx_hash },
    });
    if (tx) {
      throw new HttpException(
        'Transaction with that hash already exists',
        HttpStatus.BAD_REQUEST,
      );
    }
    tx = await this.txRepository.create(txData);
    return { id: tx.id };
  }
}

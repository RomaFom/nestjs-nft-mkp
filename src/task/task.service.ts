import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { Web3Service } from '../web3/web3.service';

@Injectable()
export class TaskService {
  constructor(private readonly web3Service: Web3Service) {}
  private readonly logger = new Logger(TaskService.name);

  @Cron('45 * * * * *')
  async handleCron() {
    await this.web3Service.indexItemsFromSC();
    this.logger.debug('Called when the current second is 45');
  }
}

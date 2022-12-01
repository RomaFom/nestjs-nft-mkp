import { forwardRef, Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { Web3Module } from '../web3/web3.module';

@Module({
  providers: [TaskService],
  imports: [forwardRef(() => Web3Module)],
  exports: [TaskService],
})
export class TaskModule {}

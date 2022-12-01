import { Module } from '@nestjs/common';
import { ItemsService } from './items.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Item } from './items.model';
import { ItemsController } from './items.controller';

@Module({
  providers: [ItemsService],
  imports: [SequelizeModule.forFeature([Item])],
  exports: [ItemsService],
  controllers: [ItemsController],
})
export class ItemsModule {}

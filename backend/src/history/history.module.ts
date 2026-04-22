import { Module } from '@nestjs/common';
import { RecipesModule } from '../recipes/recipes.module';
import { HistoryController } from './history.controller';
import { HistoryService } from './history.service';

@Module({
  imports: [RecipesModule],
  controllers: [HistoryController],
  providers: [HistoryService],
})
export class HistoryModule {}

import { Module } from '@nestjs/common';
import { RecipesModule } from '../recipes/recipes.module';
import { TagsController } from './tags.controller';
import { TagsService } from './tags.service';

@Module({
  imports: [RecipesModule],
  controllers: [TagsController],
  providers: [TagsService],
})
export class TagsModule {}

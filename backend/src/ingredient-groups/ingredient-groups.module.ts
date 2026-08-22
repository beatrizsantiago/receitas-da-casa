import { Module } from '@nestjs/common';
import { RecipesModule } from '../recipes/recipes.module';
import { IngredientGroupsController } from './ingredient-groups.controller';
import { IngredientGroupsService } from './ingredient-groups.service';

@Module({
  imports: [RecipesModule],
  controllers: [IngredientGroupsController],
  providers: [IngredientGroupsService],
})
export class IngredientGroupsModule {}

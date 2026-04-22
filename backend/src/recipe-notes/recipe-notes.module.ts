import { Module } from '@nestjs/common';
import { RecipesModule } from '../recipes/recipes.module';
import { RecipeNotesController } from './recipe-notes.controller';
import { RecipeNotesService } from './recipe-notes.service';

@Module({
  imports: [RecipesModule],
  controllers: [RecipeNotesController],
  providers: [RecipeNotesService],
})
export class RecipeNotesModule {}

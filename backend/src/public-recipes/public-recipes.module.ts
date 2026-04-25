import { Module } from '@nestjs/common';
import { PublicRecipesController } from './public-recipes.controller';
import { PublicRecipesService } from './public-recipes.service';

@Module({
  controllers: [PublicRecipesController],
  providers: [PublicRecipesService],
})
export class PublicRecipesModule {}

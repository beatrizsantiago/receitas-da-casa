import { Module } from '@nestjs/common';
import { RecipesModule } from '../recipes/recipes.module';
import { PreparationMethodsController } from './preparation-methods.controller';
import { PreparationMethodsService } from './preparation-methods.service';

@Module({
  imports: [RecipesModule],
  controllers: [PreparationMethodsController],
  providers: [PreparationMethodsService],
  exports: [PreparationMethodsService],
})
export class PreparationMethodsModule {}

import { Module } from '@nestjs/common';
import { RecipesModule } from '../recipes/recipes.module';
import { StepsController } from './steps.controller';
import { StepsService } from './steps.service';

@Module({
  imports: [RecipesModule],
  controllers: [StepsController],
  providers: [StepsService],
})
export class StepsModule {}

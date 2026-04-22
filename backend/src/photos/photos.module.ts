import { Module } from '@nestjs/common';
import { RecipesModule } from '../recipes/recipes.module';
import { StorageModule } from '../storage/storage.module';
import { PhotosController } from './photos.controller';
import { PhotosService } from './photos.service';

@Module({
  imports: [RecipesModule, StorageModule],
  controllers: [PhotosController],
  providers: [PhotosService],
})
export class PhotosModule {}

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RecipesService } from '../recipes/recipes.service';
import { StorageService } from '../storage/storage.service';
import { CreatePhotoDto } from './dto/create-photo.dto';
import { GenerateUploadUrlDto } from './dto/generate-upload-url.dto';

@Injectable()
export class PhotosService {
  constructor(
    private prisma: PrismaService,
    private recipes: RecipesService,
    private storage: StorageService,
  ) {}

  generateUploadUrl(dto: GenerateUploadUrlDto) {
    return this.storage.generateUploadUrl(dto.fileName, dto.contentType);
  }

  async create(userId: number, dto: CreatePhotoDto) {
    await this.recipes.findOne(userId, dto.recipeId);
    return this.prisma.recipePhoto.create({ data: dto });
  }
}

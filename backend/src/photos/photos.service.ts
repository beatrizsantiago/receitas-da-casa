import { Injectable, NotFoundException } from '@nestjs/common';
import { PhotoType } from '@prisma/client';
import { randomUUID } from 'crypto';
import sharp from 'sharp';
import { PrismaService } from '../prisma/prisma.service';
import { RecipesService } from '../recipes/recipes.service';
import { StorageService } from '../storage/storage.service';
import { CreatePhotoDto } from './dto/create-photo.dto';

@Injectable()
export class PhotosService {
  constructor(
    private prisma: PrismaService,
    private recipes: RecipesService,
    private storage: StorageService,
  ) {}

  async create(userId: number, file: Express.Multer.File, dto: CreatePhotoDto) {
    await this.recipes.findOne(userId, dto.recipeId);

    if (dto.type === PhotoType.COVER) {
      const existing = await this.prisma.recipePhoto.findFirst({
        where: { recipeId: dto.recipeId, type: PhotoType.COVER },
      });
      if (existing) {
        await this.storage.deleteFile(existing.url);
        await this.prisma.recipePhoto.delete({ where: { id: existing.id } });
      }
    }

    const processed = await this.processImage(file.buffer, dto.type);
    const folder = dto.type === PhotoType.COVER ? 'cover' : 'user';
    const key = `recipes/${dto.recipeId}/${folder}/${randomUUID()}.webp`;
    const url = await this.storage.uploadFile(processed, key, 'image/webp');

    return this.prisma.recipePhoto.create({
      data: { url, type: dto.type, recipeId: dto.recipeId },
    });
  }

  private async processImage(buffer: Buffer, type: PhotoType): Promise<Buffer> {
    const pipeline = sharp(buffer);
    if (type === PhotoType.COVER) {
      pipeline.resize(1280, 720, { fit: 'inside', withoutEnlargement: true });
    } else {
      pipeline.resize(1920, undefined, { fit: 'inside', withoutEnlargement: true });
    }
    return pipeline.webp({ quality: 85 }).toBuffer();
  }

  async updatePosition(userId: number, photoId: number, positionY: number) {
    const photo = await this.prisma.recipePhoto.findUnique({
      where: { id: photoId },
      include: { recipe: { select: { userId: true } } },
    });

    if (!photo || photo.recipe.userId !== userId) {
      throw new NotFoundException('Foto não encontrada');
    }

    return this.prisma.recipePhoto.update({
      where: { id: photoId },
      data: { positionY },
    });
  }
}

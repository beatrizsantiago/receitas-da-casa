import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PhotoType, RecipePhoto } from '@prisma/client';
import { randomUUID } from 'crypto';
import sharp from 'sharp';
import { PrismaService } from '../prisma/prisma.service';
import { RecipesService } from '../recipes/recipes.service';
import { StorageService } from '../storage/storage.service';
import { CreatePhotoDto } from './dto/create-photo.dto';

@Injectable()
export class PhotosService {
  private readonly logger = new Logger(PhotosService.name);

  constructor(
    private prisma: PrismaService,
    private recipes: RecipesService,
    private storage: StorageService,
  ) {}

  async create(file: Express.Multer.File, dto: CreatePhotoDto) {
    await this.recipes.findOne(dto.recipeId);

    // Primeiro garante a foto nova no storage; a antiga só sai depois
    const processed = await this.processImage(file.buffer);
    const folder = dto.type === PhotoType.COVER ? 'cover' : 'user';
    const key = `recipes/${dto.recipeId}/${folder}/${randomUUID()}.webp`;
    const url = await this.storage.uploadFile(processed, key, 'image/webp');

    let photo: RecipePhoto;
    let replaced: RecipePhoto[];
    try {
      [photo, replaced] = await this.prisma.$transaction(async (tx) => {
        let old: RecipePhoto[] = [];
        if (dto.type === PhotoType.COVER) {
          // Trava a receita: uploads de capa simultâneos são serializados e
          // não terminam com duas capas
          await tx.$queryRaw`SELECT id FROM "Recipe" WHERE id = ${dto.recipeId} FOR UPDATE`;
          old = await tx.recipePhoto.findMany({
            where: { recipeId: dto.recipeId, type: PhotoType.COVER },
          });
          await tx.recipePhoto.deleteMany({
            where: { id: { in: old.map((p) => p.id) } },
          });
        }
        const created = await tx.recipePhoto.create({
          data: { url, type: dto.type, recipeId: dto.recipeId },
        });
        return [created, old] as const;
      });
    } catch (err) {
      await this.deleteFileSafely(url);
      throw err;
    }

    // A troca já foi gravada: falhar aqui deixaria só um arquivo órfão
    for (const old of replaced) await this.deleteFileSafely(old.url);

    return photo;
  }

  private async deleteFileSafely(url: string) {
    try {
      await this.storage.deleteFile(url);
    } catch (err) {
      this.logger.warn(
        `Não foi possível apagar ${url} do storage: ${err instanceof Error ? err.message : String(err)}`,
      );
    }
  }

  private async processImage(buffer: Buffer): Promise<Buffer> {
    // rotate(): aplica a orientação do EXIF antes de descartar os metadados,
    // senão fotos de celular tiradas em pé podem ficar deitadas
    // Capa usa o mesmo limite da galeria: ela é exibida na largura toda e
    // recortada/reposicionada, então uma foto vertical encaixada em 1280x720
    // ficava com ~400px de largura e borrava ao ser esticada
    const pipeline = sharp(buffer)
      .rotate()
      .resize(1920, 1920, { fit: 'inside', withoutEnlargement: true });
    // effort 6 (máximo) + smartSubsample: arquivo menor com a mesma qualidade
    return pipeline
      .webp({ quality: 85, effort: 6, smartSubsample: true })
      .toBuffer();
  }

  async updatePosition(photoId: number, positionY: number) {
    const photo = await this.prisma.recipePhoto.findUnique({
      where: { id: photoId },
    });

    if (!photo) {
      throw new NotFoundException('Foto não encontrada');
    }

    return this.prisma.recipePhoto.update({
      where: { id: photoId },
      data: { positionY },
    });
  }
}

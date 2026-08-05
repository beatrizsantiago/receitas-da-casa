import {
  BadRequestException,
  Body,
  Controller,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CreatePhotoDto } from './dto/create-photo.dto';
import { UpdatePhotoDto } from './dto/update-photo.dto';
import { PhotosService } from './photos.service';

const MAX_PHOTO_SIZE = 8 * 1024 * 1024; // 8MB

@ApiTags('photos')
@ApiBearerAuth('access-token')
@Controller('photos')
export class PhotosController {
  constructor(private photos: PhotosService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('file', { limits: { fileSize: MAX_PHOTO_SIZE } }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Fazer upload de foto para uma receita' })
  create(
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: CreatePhotoDto,
  ) {
    if (!file) {
      throw new BadRequestException('Nenhum arquivo enviado');
    }
    return this.photos.create(file, dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar posição vertical da foto de capa' })
  updatePosition(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdatePhotoDto) {
    return this.photos.updatePosition(id, dto.positionY);
  }
}

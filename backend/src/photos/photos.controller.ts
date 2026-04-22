import { Body, Controller, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import type { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { CreatePhotoDto } from './dto/create-photo.dto';
import { GenerateUploadUrlDto } from './dto/generate-upload-url.dto';
import { PhotosService } from './photos.service';

@ApiTags('photos')
@ApiBearerAuth('access-token')
@Controller('photos')
export class PhotosController {
  constructor(private photos: PhotosService) {}

  @Post('upload-url')
  @ApiOperation({ summary: 'Gerar URL pré-assinada para upload no S3' })
  generateUploadUrl(@Body() dto: GenerateUploadUrlDto) {
    return this.photos.generateUploadUrl(dto);
  }

  @Post()
  @ApiOperation({ summary: 'Salvar metadados da foto após upload no S3' })
  create(@CurrentUser() user: JwtPayload, @Body() dto: CreatePhotoDto) {
    return this.photos.create(user.sub, dto);
  }
}

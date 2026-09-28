import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class StorageService {
  private s3: S3Client;
  private bucket: string;
  private publicBaseUrl: string;

  constructor(private config: ConfigService) {
    const region = config.getOrThrow<string>('AWS_REGION');
    this.bucket = config.getOrThrow<string>('AWS_S3_BUCKET');
    // Host customizado (MinIO, R2, Spaces...). Vazio = AWS padrão.
    const endpoint = config.get<string>('AWS_S3_ENDPOINT')?.replace(/\/+$/, '');

    this.s3 = new S3Client({
      region,
      ...(endpoint && { endpoint, forcePathStyle: true }),
      credentials: {
        accessKeyId: config.getOrThrow('AWS_ACCESS_KEY_ID'),
        secretAccessKey: config.getOrThrow('AWS_SECRET_ACCESS_KEY'),
      },
    });

    this.publicBaseUrl = endpoint
      ? `${endpoint}/${this.bucket}`
      : `https://${this.bucket}.s3.${region}.amazonaws.com`;
  }

  async uploadFile(
    buffer: Buffer,
    key: string,
    contentType: string,
  ): Promise<string> {
    await this.s3.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: buffer,
        ContentType: contentType,
      }),
    );
    return `${this.publicBaseUrl}/${key}`;
  }

  async deleteFile(url: string): Promise<void> {
    const prefix = `${this.publicBaseUrl}/`;
    // URLs antigas (de outro host) caem no fallback: key = path sem a barra inicial
    const key = url.startsWith(prefix)
      ? url.slice(prefix.length)
      : new URL(url).pathname.slice(1);
    await this.s3.send(
      new DeleteObjectCommand({ Bucket: this.bucket, Key: key }),
    );
  }
}

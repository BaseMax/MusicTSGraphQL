import { Module } from '@nestjs/common';
import { UploadService } from './upload.service';
import { UploadController } from './upload.controller';
import { S3Module } from 'nestjs-s3';
import { ConfigService } from '@nestjs/config';
@Module({
  imports: [
    S3Module.forRootAsync({
      useFactory: (c: ConfigService) => ({
        config: {
          credentials: {
            accessKeyId: c.getOrThrow('S3_ACCESS_KEY'),
            secretAccessKey: c.getOrThrow('S3_SECRET_KEY'),
          },
          endpoint: c.getOrThrow('S3_URI'),
          forcePathStyle: true,
          region: 'eu-west-1',
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [UploadService],
  exports: [UploadService],
  controllers: [UploadController],
})
export class UploadModule {}

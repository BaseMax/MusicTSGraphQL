import { Module } from '@nestjs/common';
import { ArtistsService } from './artists.service';
import { ArtistsResolver } from './artists.resolver';
import { UploadModule } from '../upload/upload.module';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [UploadModule, PrismaModule],
  providers: [ArtistsService, ArtistsResolver],
  exports: [ArtistsService],
})
export class ArtistsModule {}

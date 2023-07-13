import { Module } from '@nestjs/common';
import { GenresService } from './genres.service';
import { GenresResolver } from './genres.resolver';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  providers: [GenresService, GenresResolver],
  imports: [PrismaModule],
  exports: [GenresService],
})
export class GenresModule {}

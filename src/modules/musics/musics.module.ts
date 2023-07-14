import { forwardRef, Module } from 'typedi';
import { MusicsService } from './musics.service';
import { MusicsResolver } from './musics.resolver';
import { UploadModule } from '../upload/upload.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { GenresModule } from '../genres/genres.module';
import { SingersModule } from '../singers/singers.module';
import { MovieSingerResolver } from './music-singer/music-singer.resolver';
import { CommentsModule } from '../comments/comments.module';

@Module({
  imports: [
    UploadModule,
    PrismaModule,
    GenresModule,
    SingersModule,
    forwardRef(() => CommentsModule),
  ],
  providers: [MusicsService, MusicsResolver, MovieSingerResolver],
  exports: [MusicsService],
})
export class MusicsModule {}
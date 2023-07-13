import { forwardRef, Module } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { MoviesResolver } from './movies.resolver';
import { UploadModule } from '../upload/upload.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { GenresModule } from '../genres/genres.module';
import { ArtistsModule } from '../artists/artists.module';
import { MovieArtistResolver } from './movie-artist/movie-artist.resolver';
import { CommentsModule } from '../comments/comments.module';

@Module({
  imports: [
    UploadModule,
    PrismaModule,
    GenresModule,
    ArtistsModule,
    forwardRef(() => CommentsModule),
  ],
  providers: [MoviesService, MoviesResolver, MovieArtistResolver],
  exports: [MoviesService],
})
export class MoviesModule {}

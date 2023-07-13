import { forwardRef, Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsResolver } from './comments.resolver';
import { PrismaModule } from 'src/prisma/prisma.module';
import { MoviesModule } from '../movies/movies.module';
import { UsersModule } from '../users/users.module';

@Module({
  providers: [CommentsService, CommentsResolver],
  imports: [PrismaModule, forwardRef(() => MoviesModule), UsersModule],
  exports: [CommentsService],
})
export class CommentsModule {}

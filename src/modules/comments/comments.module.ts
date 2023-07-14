import { forwardRef, Module } from 'typedi';
import { CommentsService } from './comments.service';
import { CommentsResolver } from './comments.resolver';
import { PrismaModule } from 'src/prisma/prisma.module';
import { MusicsModule } from '../musics/musics.module';
import { UsersModule } from '../users/users.module';

@Module({
  providers: [CommentsService, CommentsResolver],
  imports: [PrismaModule, forwardRef(() => MusicsModule), UsersModule],
  exports: [CommentsService],
})
export class CommentsModule {}

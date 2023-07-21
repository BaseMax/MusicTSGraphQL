// import { forwardRef, Module } from 'tsyringe';
// import { MusicsService } from './musics.service';
// import { MusicsResolver } from './musics.resolver';
// import { UploadModule } from '../upload/upload.module';
// import { PrismaModule } from 'src/prisma/prisma.module';
// import { GenresModule } from '../genres/genres.module';
// import { SingersModule } from '../singers/singers.module';
// import { MusicSingerResolver } from './music-singer/music-singer.resolver';
// import { CommentsModule } from '../comments/comments.module';
//
// @Module({
//   imports: [
//     UploadModule,
//     PrismaModule,
//     GenresModule,
//     SingersModule,
//     forwardRef(() => CommentsModule),
//   ],
//   providers: [MusicsService, MusicsResolver, MusicSingerResolver],
//   exports: [MusicsService],
// })
// export class MusicsModule {}

import { Module } from 'tsyringe';
import { SingersService } from './singers.service';
import { SingersResolver } from './singers.resolver';
import { UploadModule } from '../upload/upload.module';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [UploadModule, PrismaModule],
  providers: [SingersService, SingersResolver],
  exports: [SingersService],
})
export class SingersModule {}

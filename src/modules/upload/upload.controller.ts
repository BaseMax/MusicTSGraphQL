import { Body, Controller, Param, Post } from '@nestjs/common';
import { MinRole } from '../auth/min-role.decorator';
import { Private } from '../auth/optional.decorator';
import { Role } from '../users/user.model';
import { UploadService } from './upload.service';

@Private()
@MinRole(Role.admin)
@Controller('upload')
export class UploadController {
  constructor(private service: UploadService) {}

  @Post('/avatar/:name')
  public async avatar(@Body() body: Buffer, @Param('name') name: string) {
    return { url: await this.service.uploadAvatar({ image: body, name }) };
  }

  @Post('/gallery/:name')
  public async gallery(@Body() body: Buffer, @Param('name') name: string) {
    return {
      url: await this.service.uploadGalleryImage({ image: body, name }),
    };
  }

  @Post('/backdrop/:name')
  public async backdrop(@Body() body: Buffer, @Param('name') name: string) {
    return { url: await this.service.uploadBackdrop({ image: body, name }) };
  }

  @Post('/poster/:name')
  public async poster(@Body() body: Buffer, @Param('name') name: string) {
    return { url: await this.service.uploadPoster({ image: body, name }) };
  }
}

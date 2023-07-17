import { PrismaService } from "../../utils/prisma.service";
import { NotFoundException } from "../../errors/notfound.exception";
import { UploadService } from "../upload/upload.service";
import { CreateSingerInput } from "./dto/create-singer.input";
import { SearchSingerInput } from "./dto/search-singer.input";
import { UpdateSingerInput } from "./dto/update-singer.input";
import { injectable } from "tsyringe";

@injectable()
export class SingersService {
  async getMusics(id: string) {
    const musics = await this.prisma.singer.findUniqueOrThrow({
      where: {
        id,
      },
      include: {
        musics: {
          include: {},
        },
      },
    });
    return musics.musics.map((m) => m);
  }
  async search(input: SearchSingerInput) {
    const query = input.text
      ? {
        OR: [
          {
            name: { search: input.text },
          },
          {
            bio: { search: input.text },
          },
        ],
      }
      : {};
    return {
      total: await this.prisma.singer.count({
        where: query,
      }),
      singers: await this.prisma.singer.findMany({
        where: query,
        skip: input.skip,
        take: input.limit,
      }),
    };
  }
  async delete(id: string) {
    await this.getByIdOrFail(id);
    await this.prisma.singer.delete({
      where: { id },
    });
    return true;
  }

  constructor(private prisma: PrismaService, private upload: UploadService) { }

  async getById(id: string) {
    return await this.prisma.singer.findUnique({
      where: { id },
    });
  }

  async getByIdOrFail(id: string) {
    const singer = await this.getById(id);
    if (!singer) {
      throw new NotFoundException(`singer not found. id: '${id}'`);
    }
    return singer;
  }

  async update(input: UpdateSingerInput) {
    await this.getByIdOrFail(input.id);
    if (input.avatar) {
      await this.upload.checkWithBucketOrFail(input.avatar, "avatars");
    }
    return this.prisma.singer.update({
      where: { id: input.id },
      data: {
        avatar: input.avatar,
        bio: input.bio,
        dateOfBirth: input.dateOfBirth,
        name: input.name,
      },
    });
  }

  async create(input: CreateSingerInput) {
    if (input.avatar) {
      await this.upload.checkWithBucketOrFail(input.avatar, "avatars");
    }
    return this.prisma.singer.create({
      data: {
        avatar: input.avatar,
        name: input.name,
        bio: input.bio,
        dateOfBirth: input.dateOfBirth,
      },
    });
  }
}
